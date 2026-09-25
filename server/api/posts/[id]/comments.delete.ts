import prisma from '~/server/utils/database'
import { requireUserId } from '~/server/utils/auth'

export default defineEventHandler(async event => {
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

	await prisma.comment.delete({
		where: { id: commentId },
	})

	return { success: true, id: commentId }
})
