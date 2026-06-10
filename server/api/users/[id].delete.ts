import prisma from '~/server/utils/database'
import { deleteCookie, getCookie } from 'h3'

export default defineEventHandler(async event => {
	const paramId = Number(getRouterParam(event, 'id'))
	const cookieUserId = Number(getCookie(event, 'userId'))

	if (!paramId || Number.isNaN(paramId)) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid user id',
		})
	}

	if (!cookieUserId || Number.isNaN(cookieUserId)) {
		throw createError({
			statusCode: 401,
			statusMessage: 'Unauthorized',
		})
	}

	if (cookieUserId !== paramId) {
		throw createError({
			statusCode: 403,
			statusMessage: 'Forbidden',
		})
	}

	const user = await prisma.user.findUnique({
		where: { id: paramId },
		select: { id: true },
	})

	if (!user) {
		throw createError({
			statusCode: 404,
			statusMessage: 'User not found',
		})
	}

	const postIds = await prisma.post.findMany({
		where: { userId: paramId },
		select: { id: true },
	})

	const ids = postIds.map(post => post.id)

	await prisma.$transaction(async tx => {
		if (ids.length > 0) {
			await tx.comment.deleteMany({
				where: { postId: { in: ids } },
			})

			await tx.postLike.deleteMany({
				where: { postId: { in: ids } },
			})

			await tx.postDislike.deleteMany({
				where: { postId: { in: ids } },
			})

			await tx.post.deleteMany({
				where: { userId: paramId },
			})
		}

		await tx.comment.deleteMany({
			where: { userId: paramId },
		})

		await tx.postLike.deleteMany({
			where: { userId: paramId },
		})

		await tx.postDislike.deleteMany({
			where: { userId: paramId },
		})

		await tx.user.delete({
			where: { id: paramId },
		})
	})

	deleteCookie(event, 'userId', {
		path: '/',
	})

	return { success: true }
})
