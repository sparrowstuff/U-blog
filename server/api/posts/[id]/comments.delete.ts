import prisma from '~/server/utils/database'
import { requireUserId } from '~/server/utils/auth'
import {
	createRateLimitKey,
	enforceRateLimit,
	getClientIp,
} from '~/server/utils/rate-limiter'

const COMMENT_DELETE_IP_LIMIT = 120
const COMMENT_DELETE_USER_LIMIT = 30
const COMMENT_DELETE_WINDOW_MS = 60 * 60 * 1000

export default defineEventHandler(async event => {
	const clientIp = getClientIp(event)

	enforceRateLimit(event, {
		key: createRateLimitKey('comment-delete', 'ip', clientIp),
		limit: COMMENT_DELETE_IP_LIMIT,
		windowMs: COMMENT_DELETE_WINDOW_MS,
	})

	const userId = await requireUserId(event)
	const postId = Number(getRouterParam(event, 'id'))

	const body = await readBody<{ commentId: number }>(event)

	const commentId = Number(body.commentId)

	if (!Number.isInteger(postId) || postId <= 0) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid post id',
		})
	}

	if (!Number.isInteger(commentId) || commentId <= 0) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid comment id',
		})
	}

	const comment = await prisma.comment.findUnique({
		where: { id: commentId },
		select: {
			id: true,
			postId: true,
			userId: true,
		},
	})

	if (!comment || comment.postId !== postId) {
		throw createError({
			statusCode: 404,
			statusMessage: 'Comment not found',
		})
	}

	if (comment.userId !== userId) {
		throw createError({
			statusCode: 403,
			statusMessage: 'You can delete only your own comment',
		})
	}

	enforceRateLimit(event, {
		key: createRateLimitKey('comment-delete', 'user', userId),
		limit: COMMENT_DELETE_USER_LIMIT,
		windowMs: COMMENT_DELETE_WINDOW_MS,
	})

	await prisma.comment.delete({
		where: { id: commentId },
	})

	return { success: true, id: commentId }
})
