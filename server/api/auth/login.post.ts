import prisma from '~/server/utils/database'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { setAuthCookie } from '~/server/utils/auth'
import {
	createRateLimitKey,
	enforceRateLimit,
	getClientIp,
} from '~/server/utils/rate-limiter'

const LOGIN_IP_LIMIT = 20
const LOGIN_EMAIL_IP_LIMIT = 8
const LOGIN_WINDOW_MS = 15 * 60 * 1000

const DUMMY_PASSWORD_HASH =
	'$2b$10$Jj0I9j4NVs0SBv5EWDYZL.3x0zvSkNKN3Pd5M8tSKn4USywnLzOEy'

const loginSchema = z.object({
	email: z.string().trim().toLowerCase().email('Некорректный email'),

	password: z.string().min(6, 'Пароль минимум 6 символов'),
})

export default defineEventHandler(async event => {
	const clientIp = getClientIp(event)

	enforceRateLimit(event, {
		key: createRateLimitKey('login', 'ip', clientIp),
		limit: LOGIN_IP_LIMIT,
		windowMs: LOGIN_WINDOW_MS,
	})

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

	enforceRateLimit(event, {
		key: createRateLimitKey('login', 'ip-email', clientIp, data.email),
		limit: LOGIN_EMAIL_IP_LIMIT,
		windowMs: LOGIN_WINDOW_MS,
	})

	const user = await prisma.user.findUnique({
		where: {
			email: data.email,
		},
	})

	const passwordHash = user?.password ?? DUMMY_PASSWORD_HASH

	const isValidPassword = await bcrypt.compare(data.password, passwordHash)

	if (!user || !isValidPassword) {
		throw createError({
			statusCode: 401,
			statusMessage: 'Invalid credentials',
			data: {
				fieldErrors: {
					form: 'Неверный email или пароль',
				},
			},
		})
	}

	await setAuthCookie(event, user.id)

	return {
		id: user.id,
		name: user.name,
		surName: user.surName,
		email: user.email,
		createdAt: user.createdAt,
		isAdmin: user.isAdmin,
	}
})
