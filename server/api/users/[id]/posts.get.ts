import prisma from '~/server/utils/database'

export default defineEventHandler(async event => {
	const userId = Number(getRouterParam(event, 'id'))

	if (!userId || Number.isNaN(userId)) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid user id',
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

	const posts = await prisma.post.findMany({
		where: { userId },
		orderBy: { createdAt: 'desc' },
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
			_count: {
				select: {
					likes: true,
					dislikes: true,
				},
			},
			likes: {
				select: {
					userId: true,
				},
			},
			dislikes: {
				select: {
					userId: true,
				},
			},
		},
	})

	return posts.map(post => {
		const liked = post.likes.length > 0
		const disliked = post.dislikes.length > 0

		return {
			id: post.id,
			title: post.title,
			description: post.description,
			createdAt: post.createdAt,
			updatedAt: post.updatedAt,
			user: post.user,
			likesCount: post._count.likes,
			dislikesCount: post._count.dislikes,
			userReaction: liked ? 'like' : disliked ? 'dislike' : null,
		}
	})
})
