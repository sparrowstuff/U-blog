import prisma from '~/server/utils/database'

export default defineEventHandler(async event => {
	const id = Number(getRouterParam(event, 'id'))

	if (!id || Number.isNaN(id)) {
		throw createError({ statusCode: 400, statusMessage: 'Invalid user id' })
	}

	const user = await prisma.user.findUnique({
		where: { id },
		include: {
			posts: true,
		},
	})

	if (!user) {
		throw createError({
			statusCode: 404,
			statusMessage: 'user not found',
		})
	}

	return {
		id: user.id,
		name: user.name,
		surName: user.surName,
		email: user.email,
		createdAt: user.createdAt,
		isAdmin: user.isAdmin,
		posts: user.posts,
	}
})
