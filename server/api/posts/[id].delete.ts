import prisma from '~/server/utils/database'
import { requireUserId } from '~/server/utils/auth'
import {
	createRateLimitKey,
	enforceRateLimit,
	getClientIp,
} from '~/server/utils/rate-limiter'

const POST_DELETE_IP_LIMIT = 60
const POST_DELETE_USER_LIMIT = 20
const POST_DELETE_WINDOW_MS = 60 * 60 * 1000

export default defineEventHandler(async event => {
	const clientIp = getClientIp(event)

	enforceRateLimit(event, {
		key: createRateLimitKey('post-delete', 'ip', clientIp),
		limit: POST_DELETE_IP_LIMIT,
		windowMs: POST_DELETE_WINDOW_MS,
	})

	const postId = Number(getRouterParam(event, 'id'))

	if (!Number.isInteger(postId) || postId <= 0) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Некорректный id поста',
		})
	}

	const userId = await requireUserId(event)

	const post = await prisma.post.findUnique({
		where: { id: postId },
		select: { id: true, userId: true },
	})

	if (!post) {
		throw createError({
			statusCode: 404,
			statusMessage: 'Пост не найден',
		})
	}

	if (post.userId !== userId) {
		throw createError({
			statusCode: 403,
			statusMessage: 'Нет прав на удаление этого поста',
		})
	}

	enforceRateLimit(event, {
		key: createRateLimitKey('post-delete', 'user', userId),
		limit: POST_DELETE_USER_LIMIT,
		windowMs: POST_DELETE_WINDOW_MS,
	})

	await prisma.post.delete({
		where: { id: postId },
	})

	return { success: true, id: postId }
})
