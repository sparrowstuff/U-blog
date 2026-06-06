import prisma from '~/server/utils/database'
import { deleteCookie, getCookie } from 'h3'

export default defineEventHandler(async event => {
	const userId = Number(getRouterParam(event, 'id'))

	if (!userId || Number.isNaN(userId)) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid user id',
		})
	}

	console.log('cookie auth:', getCookie(event, 'userId'))
	console.log('context user:', event.context.user)

	const currentUserId = event.context.user?.id

	if (!currentUserId) {
		throw createError({
			statusCode: 401,
			statusMessage: 'Unauthorized',
		})
	}

	if (currentUserId !== userId) {
		throw createError({
			statusCode: 403,
			statusMessage: 'Forbidden',
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

	const postIds = await prisma.post.findMany({
		where: { userId },
		select: { id: true },
	})

	const ids = postIds.map(post => post.id)

	await prisma.$transaction(async tx => {
		if (ids.length > 0) {
			await tx.comment.deleteMany({
				where: {
					postId: {
						in: ids,
					},
				},
			})

			await tx.postLike.deleteMany({
				where: {
					postId: {
						in: ids,
					},
				},
			})

			await tx.postDislike.deleteMany({
				where: {
					postId: {
						in: ids,
					},
				},
			})

			await tx.post.deleteMany({
				where: {
					userId,
				},
			})
		}

		await tx.comment.deleteMany({
			where: {
				userId,
			},
		})

		await tx.postLike.deleteMany({
			where: {
				userId,
			},
		})

		await tx.postDislike.deleteMany({
			where: {
				userId,
			},
		})

		await tx.user.delete({
			where: { id: userId },
		})
	})

	const authCookieName = 'userId'

	deleteCookie(event, authCookieName, {
		path: '/',
	})

	return { success: true }
})
