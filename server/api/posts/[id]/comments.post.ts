import prisma from '~/server/utils/database'
import { requireUserId } from '~/server/utils/auth'
import {
	createRateLimitKey,
	enforceRateLimit,
	getClientIp,
} from '~/server/utils/rate-limiter'
import { z } from 'zod'

const commentSchema = z.object({
	content: z
		.string()
		.trim()
		.min(1, 'Comment content is required')
		.max(2000, 'Comment content must be at most 2000 characters'),
})

const COMMENT_IP_LIMIT = 120
const COMMENT_USER_LIMIT = 30
const COMMENT_USER_POST_LIMIT = 5

const COMMENT_WINDOW_MS = 60 * 60 * 1000
const COMMENT_POST_WINDOW_MS = 10 * 60 * 1000

export default defineEventHandler(async event => {
	const clientIp = getClientIp(event)

	enforceRateLimit(event, {
		key: createRateLimitKey('comment', 'ip', clientIp),
		limit: COMMENT_IP_LIMIT,
		windowMs: COMMENT_WINDOW_MS,
	})

	const userId = await requireUserId(event)
	const postId = Number(getRouterParam(event, 'id'))

	if (!Number.isInteger(postId) || postId <= 0) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid post id',
		})
	}

	if (!postId || Number.isNaN(postId)) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid post id',
		})
	}

	const body = await readBody(event)
	const parsed = commentSchema.safeParse(body)

	if (!parsed.success) {
		throw createError({
			statusCode: 400,
			statusMessage: parsed.error.issues[0]?.message,
		})
	}

	const post = await prisma.post.findUnique({
		where: { id: postId },
		select: { id: true },
	})

	if (!userId || Number.isNaN(userId)) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid user id',
		})
	}

	if (!post) {
		throw createError({
			statusCode: 404,
			statusMessage: 'Post not found',
		})
	}

	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: { id: true },
	})

	if (!user) {
		throw createError({
			statusCode: 404,
			statusMessage: 'User not found',
		})
	}

	enforceRateLimit(event, {
		key: createRateLimitKey('comment', 'user', userId),
		limit: COMMENT_USER_LIMIT,
		windowMs: COMMENT_WINDOW_MS,
	})

	enforceRateLimit(event, {
		key: createRateLimitKey('comment', 'user-post', userId, postId),
		limit: COMMENT_USER_POST_LIMIT,
		windowMs: COMMENT_POST_WINDOW_MS,
	})

	return prisma.comment.create({
		data: {
			content: parsed.data.content,
			postId,
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
