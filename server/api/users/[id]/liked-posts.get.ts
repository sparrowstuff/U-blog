import prisma from '~/server/utils/database'
import { getRouterParam, createError } from 'h3'
import { Prisma } from '@prisma/client'
import type { ReactionType } from '@/types/Reaction'

const likedPostsArgs = Prisma.validator<Prisma.PostLikeFindManyArgs>()({
	where: {},
	include: {
		post: {
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
			},
		},
	},
})

type LikedPostRecord = Prisma.PostLikeGetPayload<typeof likedPostsArgs>

export default defineEventHandler(async event => {
	const userId = Number(getRouterParam(event, 'id'))

	if (!userId || Number.isNaN(userId)) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid user id',
		})
	}

	const likedPosts = await prisma.postLike.findMany({
		where: { userId },
		orderBy: { createdAt: 'desc' },
		include: likedPostsArgs.include,
	})

	const result = likedPosts.map(item => ({
		id: item.post.id,
		title: item.post.title,
		description: item.post.description,
		userId: item.post.userId,
		createdAt: item.post.createdAt,
		updatedAt: item.post.updatedAt,
		likesCount: item.post._count.likes,
		dislikesCount: item.post._count.dislikes,
		userReaction: 'like' as ReactionType,
		user: item.post.user,
	}))

	return result
})
