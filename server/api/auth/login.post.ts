import prisma from '~/server/utils/database'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { setCookie } from 'h3'

const loginSchema = z.object({
	email: z.string().email('Некорректный email'),
	password: z.string().min(6, 'Пароль минимум 6 символов'),
})

export default defineEventHandler(async event => {
	const body = await readBody(event)

	const parsed = loginSchema.safeParse(body)

	if (!parsed.success) {
		const fieldErrors: Record<string, string> = {}

		for (const issue of parsed.error.issues) {
			const key = String(issue.path[0] ?? 'form')
			fieldErrors[key] = issue.message
		}

		throw createError({
			statusCode: 400,
			statusMessage: 'Validation error',
			data: { fieldErrors },
		})
	}

	const data = parsed.data

	const user = await prisma.user.findUnique({
		where: { email: data.email },
	})

	if (!user) {
		throw createError({
			statusCode: 404,
			statusMessage: 'Validation error',
			data: {
				fieldErrors: {
					email: 'Пользователь не найден',
				},
			},
		})
	}

	const isValid = await bcrypt.compare(data.password, user.password)

	if (!isValid) {
		throw createError({
			statusCode: 401,
			statusMessage: 'Validation error',
			data: {
				fieldErrors: {
					password: 'Неверный пароль',
				},
			},
		})
	}

	setCookie(event, 'userId', String(user.id), {
		httpOnly: true,
		sameSite: 'lax',
		path: '/',
		maxAge: 60 * 60 * 24 * 3,
	})

	return {
		id: user.id,
		name: user.name,
		surName: user.surName,
		email: user.email,
		createdAt: user.createdAt,
		isAdmin: user.isAdmin,
	}
})
