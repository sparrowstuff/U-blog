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
				},
			},
		},
	})

	return posts
})
