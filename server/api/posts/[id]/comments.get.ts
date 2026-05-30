import prisma from '~/server/utils/database'

export default defineEventHandler(async event => {
	const postId = Number(getRouterParam(event, 'id'))

	if (!postId || Number.isNaN(postId)) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid post id',
		})
	}

	const post = await prisma.post.findUnique({
		where: { id: postId },
		select: { id: true },
	})

	if (!post) {
		throw createError({
			statusCode: 404,
			statusMessage: 'Post not found',
		})
	}

	const comments = await prisma.comment.findMany({
		where: { postId },
		orderBy: { createdAt: 'asc' },
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

	return comments
})
