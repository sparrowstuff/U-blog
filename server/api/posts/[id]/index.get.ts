import prisma from '~/server/utils/database'
import { getCookie } from 'h3'
import { ReactionType } from '@/types/Reaction'

export default defineEventHandler(async event => {
	const postId = Number(getRouterParam(event, 'id'))

	if (!postId || Number.isNaN(postId)) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid post id',
		})
	}

	const userIdCookie = getCookie(event, 'userId')
	const currentUserId = userIdCookie ? Number(userIdCookie) : null

	const post = await prisma.post.findUnique({
		where: { id: postId },
		include: {
			user: {
				select: {
					id: true,
					name: true,
					surName: true,
					email: true,
				},
			},
			comments: true,
			_count: {
				select: {
					likes: true,
					dislikes: true,
				},
			},
		},
	})

	if (!post) {
		throw createError({
			statusCode: 404,
			statusMessage: 'Post not found',
		})
	}

	let userReaction: ReactionType = null

	if (currentUserId) {
		const [like, dislike] = await Promise.all([
			prisma.postLike.findUnique({
				where: {
					postId_userId: {
						postId,
						userId: currentUserId,
					},
				},
			}),
			prisma.postDislike.findUnique({
				where: {
					postId_userId: {
						postId,
						userId: currentUserId,
					},
				},
			}),
		])

		userReaction = like ? 'like' : dislike ? 'dislike' : null
	}

	return {
		id: post.id,
		title: post.title,
		description: post.description,
		userId: post.userId,
		createdAt: post.createdAt,
		updatedAt: post.updatedAt,
		likesCount: post._count.likes,
		dislikesCount: post._count.dislikes,
		userReaction,
		user: post.user,
		comments: post.comments,
	}
})
