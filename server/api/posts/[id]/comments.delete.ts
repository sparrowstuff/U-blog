import prisma from '~/server/utils/database'
import { getCookie } from 'h3'

export default defineEventHandler(async event => {
	const postId = Number(getRouterParam(event, 'id'))
	const body = await readBody<{ commentId: number }>(event)
	const commentId = Number(body.commentId)

	if (!postId || Number.isNaN(postId)) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid post id',
		})
	}

	if (!commentId || Number.isNaN(commentId)) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid comment id',
		})
	}

	const userIdCookie = getCookie(event, 'userId')

	if (!userIdCookie) {
		throw createError({
			statusCode: 401,
			statusMessage: 'Unauthorized',
		})
	}

	const currentUserId = Number(userIdCookie)

	const comment = await prisma.comment.findUnique({
		where: { id: commentId },
	})

	if (!comment || comment.postId !== postId) {
		throw createError({
			statusCode: 404,
			statusMessage: 'Comment not found',
		})
	}

	if (comment.userId !== currentUserId) {
		throw createError({
			statusCode: 403,
			statusMessage: 'You can delete only your own comment',
		})
	}

	await prisma.comment.delete({
		where: { id: commentId },
	})

	return { success: true, id: commentId }
})
