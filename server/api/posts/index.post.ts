import prisma from '~/server/utils/database'
import { requireUserId } from '~/server/utils/auth'
import {
	createRateLimitKey,
	enforceRateLimit,
	getClientIp,
} from '~/server/utils/rate-limiter'
import { z } from 'zod'

const postSchema = z.object({
	title: z.string().trim().min(1, 'Введите заголовок'),
	description: z.string().trim().min(5, 'Введите пост'),
})

const POST_IP_LIMIT = 60
const POST_USER_LIMIT = 10
const POST_WINDOW_MS = 60 * 60 * 1000

export default defineEventHandler(async event => {
	const clientIp = getClientIp(event)

	enforceRateLimit(event, {
		key: createRateLimitKey('post', 'ip', clientIp),
		limit: POST_IP_LIMIT,
		windowMs: POST_WINDOW_MS,
	})

	const userId = await requireUserId(event)
	const body = await readBody(event)
	const parsed = postSchema.safeParse(body)

	if (!parsed.success) {
		const fieldErrors: Record<string, string> = {}

		for (const issue of parsed.error.issues) {
			const key = String(issue.path[0] ?? 'form')
			fieldErrors[key] = issue.message
		}

		throw createError({
			statusCode: 400,
			statusMessage: 'Validation Error',
			data: { fieldErrors },
		})
	}

	enforceRateLimit(event, {
		key: createRateLimitKey('post', 'user', userId),
		limit: POST_USER_LIMIT,
		windowMs: POST_WINDOW_MS,
	})

	return prisma.post.create({
		data: {
			title: parsed.data.title,
			description: parsed.data.description,
			userId,
		},
		include: {
			user: {
				select: {
					id: true,
					name: true,
					surName: true,
					email: true,
					avatarUrl: true,
				},
			},
		},
	})
})
