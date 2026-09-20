import prisma from '~/server/utils/database'
import { requireUserId } from '~/server/utils/auth'

export default defineEventHandler(async event => {
	const requestedUserId = Number(getRouterParam(event, 'id'))
	const userId = await requireUserId(event)

	if (!Number.isInteger(requestedUserId) || requestedUserId <= 0) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid user id',
		})
	}

	if (requestedUserId !== userId) {
		throw createError({
			statusCode: 403,
			statusMessage: 'Forbidden',
		})
	}

	const posts = await prisma.post.findMany({
		where: { userId: requestedUserId },
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
				where: { userId: userId },
				select: { id: true },
			},
			dislikes: {
				where: { userId: userId },
				select: { id: true },
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
			// userReaction: liked ? 'like' : disliked ? 'dislike' : null,
			userReaction:
				post.likes.length > 0
					? 'like'
					: post.dislikes.length > 0
						? 'dislike'
						: null,
		}
	})
})
