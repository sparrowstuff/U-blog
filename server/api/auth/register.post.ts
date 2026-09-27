import prisma from '~/server/utils/database'
import { Prisma } from '@prisma/client'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { setAuthCookie } from '~/server/utils/auth'
import {
	createRateLimitKey,
	enforceRateLimit,
	getClientIp,
} from '@/server/utils/rate-limiter'

const REGISTER_IP_LIMIT = 5
const REGISTER_EMAIL_IP_LIMIT = 3
const REGISTER_WINDOW_MS = 60 * 60 * 1000

const registerSchema = z.object({
	name: z.string().trim().min(2, 'Имя минимум 2 символа'),

	surName: z.string().trim().min(2, 'Фамилия минимум 2 символа'),

	email: z.string().trim().toLowerCase().email('Некорректный email'),

	password: z.string().min(6, 'Пароль минимум 6 символов'),

	confirmPassword: z.string().min(6, 'Подтвердите пароль'),
})

export default defineEventHandler(async event => {
	const clientIP = getClientIp(event)

	enforceRateLimit(event, {
		key: createRateLimitKey('register', 'ip', clientIP),
		limit: REGISTER_IP_LIMIT,
		windowMs: REGISTER_WINDOW_MS,
	})

	const body = await readBody(event)
	const parsed = registerSchema.safeParse(body)

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

	enforceRateLimit(event, {
		key: createRateLimitKey('register', 'ip-email', clientIP, data.email),
		limit: REGISTER_EMAIL_IP_LIMIT,
		windowMs: REGISTER_WINDOW_MS,
	})

	const hashedPassword = await bcrypt.hash(data.password, 10)

	try {
		const user = await prisma.user.create({
			data: {
				name: data.name,
				surName: data.surName,
				email: data.email,
				password: hashedPassword,
			},
		})

		await setAuthCookie(event, user.id)

		return {
			id: user.id,
			name: user.name,
			surName: user.surName,
			email: user.email,
			createdAt: user.createdAt,
			isAdmin: user.isAdmin,
		}
	} catch (error: unknown) {
		if (
			error instanceof Prisma.PrismaClientKnownRequestError &&
			error.code === 'P2002'
		) {
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

		throw error
	}
})
