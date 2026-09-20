import prisma from '~/server/utils/database'
// import { deleteCookie, getCookie } from 'h3'
import { clearAuthCookie, requireUserId } from '~/server/utils/auth'

export default defineEventHandler(async event => {
	const paramId = Number(getRouterParam(event, 'id'))
	const currentUserId = await requireUserId(event)

	if (!Number.isInteger(paramId) || paramId <= 0) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid user id',
		})
	}

	if (!paramId || Number.isNaN(paramId)) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid user id',
		})
	}

	// if (!cookieUserId || Number.isNaN(cookieUserId)) {
	// 	throw createError({
	// 		statusCode: 401,
	// 		statusMessage: 'Unauthorized',
	// 	})
	// }

	if (currentUserId !== paramId) {
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

	await clearAuthCookie(event)

	return { success: true }
})
