import prisma from '~/server/utils/database'
import { getCookie } from 'h3'

type ReactionType = 'like' | 'dislike'

export default defineEventHandler(async event => {
	const postId = Number(getRouterParam(event, 'id'))
	const body = await readBody<{ type: ReactionType }>(event)
	const type = body.type

	if (!postId || Number.isNaN(postId)) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid post id',
		})
	}

	if (type !== 'like' && type !== 'dislike') {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid reaction type',
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

	if (!currentUserId || Number.isNaN(currentUserId)) {
		throw createError({
			statusCode: 401,
			statusMessage: 'Unauthorized',
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

	const result = await prisma.$transaction(async tx => {
		const [like, dislike] = await Promise.all([
			tx.postLike.findUnique({
				where: {
					postId_userId: {
						postId,
						userId: currentUserId,
					},
				},
			}),
			tx.postDislike.findUnique({
				where: {
					postId_userId: {
						postId,
						userId: currentUserId,
					},
				},
			}),
		])

		if (type === 'like') {
			if (dislike) {
				await tx.postDislike.delete({
					where: {
						postId_userId: {
							postId,
							userId: currentUserId,
						},
					},
				})
			}

			if (like) {
				await tx.postLike.delete({
					where: {
						postId_userId: {
							postId,
							userId: currentUserId,
						},
					},
				})
			} else {
				await tx.postLike.create({
					data: {
						postId,
						userId: currentUserId,
					},
				})
			}
		}

		if (type === 'dislike') {
			if (like) {
				await tx.postLike.delete({
					where: {
						postId_userId: {
							postId,
							userId: currentUserId,
						},
					},
				})
			}

			if (dislike) {
				await tx.postDislike.delete({
					where: {
						postId_userId: {
							postId,
							userId: currentUserId,
						},
					},
				})
			} else {
				await tx.postDislike.create({
					data: {
						postId,
						userId: currentUserId,
					},
				})
			}
		}

		const [likesCount, dislikesCount, userLike, userDislike] =
			await Promise.all([
				tx.postLike.count({ where: { postId } }),
				tx.postDislike.count({ where: { postId } }),
				tx.postLike.findUnique({
					where: {
						postId_userId: {
							postId,
							userId: currentUserId,
						},
					},
				}),
				tx.postDislike.findUnique({
					where: {
						postId_userId: {
							postId,
							userId: currentUserId,
						},
					},
				}),
			])

		return {
			likesCount,
			dislikesCount,
			userReaction: userLike ? 'like' : userDislike ? 'dislike' : null,
		}
	})

	return {
		success: true,
		...result,
	}
})
