import prisma from '~/server/utils/database'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { setCookie } from 'h3'

const registerSchema = z.object({
	name: z.string().min(2, 'Имя минимум 2 символа'),
	surName: z.string().min(2, 'Фамилия минимум 2 символа'),
	email: z.string().email('Некорректный email'),
	password: z.string().min(6, 'Пароль минимум 6 символов'),
	confirmPassword: z.string().min(6, 'Подтвердите пароль'),
})

export default defineEventHandler(async event => {
	const body = await readBody(event)

	const parsed = registerSchema.safeParse(body)

	if (!parsed.success) {
		const fieldErrors: Record<string, string> = {}

		for (const issue of parsed.error.issues) {
			const key = String(issue.path[0 ?? 'form'])
			fieldErrors[key] = issue.message
		}

		throw createError({
			statusCode: 400,
			statusMessage: 'Validation error',
			data: { fieldErrors },
		})
	}

	const data = parsed.data

	if (data.password !== data.confirmPassword) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Validation error',
			data: {
				fieldErrors: {
					confirmPassword: 'Пароли не совпадают',
				},
			},
		})
	}

	const existingUser = await prisma.user.findUnique({
		where: { email: data.email },
	})

	if (existingUser) {
		throw createError({
			statusCode: 409,
			statusMessage: 'Пользователь с такой почтой уже зарегистрирован',
			data: {
				fieldErrors: {
					email: 'Пользователь уже существует',
				},
			},
		})
	}

	const hashedPassword = await bcrypt.hash(data.password, 10)

	const user = await prisma.user.create({
		data: {
			name: data.name,
			surName: data.surName,
			email: data.email,
			password: hashedPassword,
		},
	})

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
