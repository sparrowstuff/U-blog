import prisma from '~/server/utils/database'
import { requireUserId } from '~/server/utils/auth'
import {
	createRateLimitKey,
	enforceRateLimit,
	getClientIp,
} from '~/server/utils/rate-limiter'
import { ReactionType } from '@/types/Reaction'

const REACTION_IP_LIMIT = 240
const REACTION_USER_LIMIT = 120
const REACTION_USER_POST_LIMIT = 20

const REACTION_WINDOW_MS = 60 * 60 * 1000
const REACTION_POST_WINDOW_MS = 60 * 1000

export default defineEventHandler(async event => {
	const clientIp = getClientIp(event)

	enforceRateLimit(event, {
		key: createRateLimitKey('reaction', 'ip', clientIp),
		limit: REACTION_IP_LIMIT,
		windowMs: REACTION_POST_WINDOW_MS,
	})

	const userId = await requireUserId(event)
	const postId = Number(getRouterParam(event, 'id'))
	const body = await readBody<{ type: ReactionType }>(event)
	const type = body.type

	if (!Number.isInteger(postId) || postId <= 0) {
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

	enforceRateLimit(event, {
		key: createRateLimitKey('reaction', 'user', userId),
		limit: REACTION_USER_LIMIT,
		windowMs: REACTION_WINDOW_MS,
	})

	enforceRateLimit(event, {
		key: createRateLimitKey('reaction', 'user-post', userId, postId),
		limit: REACTION_USER_POST_LIMIT,
		windowMs: REACTION_POST_WINDOW_MS,
	})

	const result = await prisma.$transaction(async tx => {
		const [like, dislike] = await Promise.all([
			tx.postLike.findUnique({
				where: {
					postId_userId: {
						postId,
						userId: userId,
					},
				},
			}),
			tx.postDislike.findUnique({
				where: {
					postId_userId: {
						postId,
						userId: userId,
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
							userId: userId,
						},
					},
				})
			}

			if (like) {
				await tx.postLike.delete({
					where: {
						postId_userId: {
							postId,
							userId: userId,
						},
					},
				})
			} else {
				await tx.postLike.create({
					data: {
						postId,
						userId: userId,
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
							userId: userId,
						},
					},
				})
			}

			if (dislike) {
				await tx.postDislike.delete({
					where: {
						postId_userId: {
							postId,
							userId: userId,
						},
					},
				})
			} else {
				await tx.postDislike.create({
					data: {
						postId,
						userId: userId,
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
							userId: userId,
						},
					},
				}),
				tx.postDislike.findUnique({
					where: {
						postId_userId: {
							postId,
							userId: userId,
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
