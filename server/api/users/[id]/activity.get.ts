import prisma from '~/server/utils/database'
import { requireUserId } from '~/server/utils/auth'
import { createError, getRouterParam } from 'h3'
import type { ReactionType } from '~/types/Reaction'

export default defineEventHandler(async event => {
	const paramId = Number(getRouterParam(event, 'id'))
	const currentUserId = await requireUserId(event)

	if (!Number.isInteger(paramId) || paramId <= 0) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid user id',
		})
	}

	if (currentUserId !== paramId) {
		throw createError({
			statusCode: 403,
			statusMessage: 'Forbidden',
		})
	}

	const user = await prisma.user.findUnique({
		where: {
			id: currentUserId,
		},
		select: {
			id: true,
		},
	})

	if (!user) {
		throw createError({
			statusCode: 404,
			statusMessage: 'User not found',
		})
	}

	const [likedPostRecord, comments] = await Promise.all([
		prisma.postLike.findMany({
			where: {
				userId: currentUserId,
			},
			orderBy: {
				createdAt: 'desc',
			},
			select: {
				id: true,
				createdAt: true,

				post: {
					select: {
						id: true,
						title: true,
						description: true,
						userId: true,
						createdAt: true,
						updatedAt: true,

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
					},
				},
			},
		}),

		prisma.comment.findMany({
			where: {
				userId: currentUserId,
			},
			orderBy: { createdAt: 'desc' },
			select: {
				id: true,
				content: true,
				createdAt: true,
				updatedAt: true,
				postId: true,
				userId: true,

				user: {
					select: {
						id: true,
						name: true,
						surName: true,
						email: true,
						avatarUrl: true,
					},
				},

				post: {
					select: {
						id: true,
						title: true,
						userId: true,
					},
				},
			},
		}),
	])

	const likedPosts = likedPostRecord.map(record => ({
		id: record.post.id,
		title: record.post.title,
		description: record.post.description,
		userId: record.post.userId,
		createdAt: record.post.createdAt,
		updatedAt: record.post.updatedAt,
		likesCount: record.post._count.likes,
		dislikesCount: record.post._count.dislikes,

		userReaction: 'like' as ReactionType,

		user: record.post.user,
	}))

	return { likedPosts, comments }
})
