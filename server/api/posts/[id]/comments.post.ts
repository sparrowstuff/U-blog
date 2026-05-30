import prisma from '~/server/utils/database'

export default defineEventHandler(async event => {
	const postId = Number(getRouterParam(event, 'id'))

	if (!postId || Number.isNaN(postId)) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid post id',
		})
	}

	const body = await readBody<{
		content?: string
		userId?: number
	}>(event)

	const content = body.content?.trim()
	const userId = Number(body.userId)

	if (!content) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Comment content is required',
		})
	}

	if (!userId || Number.isNaN(userId)) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid user id',
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

	const comment = await prisma.comment.create({
		data: {
			content,
			postId,
			userId,
		},
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
		},
	})

	return comment
})
