import prisma from '~/server/utils/database'
import { requireUserId } from '~/server/utils/auth'

export default defineEventHandler(async event => {
	const postId = Number(getRouterParam(event, 'id'))
	const userId = await requireUserId(event)
	// const body = await readBody<{ userId: number }>(event)

	if (!Number.isInteger(postId) || postId <= 0) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Некорректный id поста',
		})
	}

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

	// if (!body?.userId) {
	// 	throw createError({
	// 		statusCode: 400,
	// 		statusMessage: 'userId обязателен',
	// 	})
	// }

	if (post.userId !== userId) {
		throw createError({
			statusCode: 403,
			statusMessage: 'Нет прав на удаление этого поста',
		})
	}

	await prisma.post.delete({
		where: { id: postId },
	})

	return { success: true, id: postId }
})
