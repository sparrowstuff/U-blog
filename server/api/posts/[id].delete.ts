import prisma from '~/server/utils/database'

export default defineEventHandler(async event => {
	const postId = Number(getRouterParam(event, 'id'))
	const body = await readBody<{ userId: number }>(event)

	if (!postId || Number.isNaN(postId)) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Некорректный id поста',
		})
	}

	if (!body?.userId) {
		throw createError({
			statusCode: 400,
			statusMessage: 'userId обязателен',
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

	if (post.userId !== body.userId) {
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
