import prisma from '~/server/utils/database'

export default defineEventHandler(async event => {
	const id = Number(getRouterParam(event, 'id'))

	if (!id || Number.isNaN(id)) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid post id',
		})
	}

	const post = await prisma.post.findUnique({
		where: { id },
		include: {
			user: {
				select: {
					id: true,
					name: true,
					surName: true,
					email: true,
				},
			},
			comments: {
				orderBy: {
					createdAt: 'asc',
				},
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
			},
		},
	})

	if (!post) {
		throw createError({
			statusCode: 404,
			statusMessage: 'Post not found',
		})
	}

	return post
})
