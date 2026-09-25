import prisma from '~/server/utils/database'
import { requireUserId } from '~/server/utils/auth'
import { z } from 'zod'

const commentSchema = z.object({
	content: z
		.string()
		.trim()
		.min(1, 'Comment content is required')
		.max(2000, 'Comment content must be at most 2000 characters'),
})

export default defineEventHandler(async event => {
	const userId = await requireUserId(event)
	const postId = Number(getRouterParam(event, 'id'))

	if (!Number.isInteger(postId) || postId <= 0) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid post id',
		})
	}

	const body = await readBody(event)
	const parsed = commentSchema.safeParse(body)

	if (!parsed.success) {
		throw createError({
			statusCode: 400,
			statusMessage: parsed.error.issues[0]?.message,
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

	return prisma.comment.create({
		data: {
			content: parsed.data.content,
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
})
