import prisma from '../utils/database'
import { z } from 'zod'

const postSchema = z.object({
	userId: z.number().int().positive(),
	title: z.string().min(3),
	description: z.string().min(5),
})

export default defineEventHandler(async event => {
	const body = await readBody(event)
	const data = postSchema.parse(body)

	const user = await prisma.user.findUnique({ where: { id: data.userId } })

	if (!user) {
		throw createError({
			statusCode: 404,
			statusMessage: 'User not found',
		})
	}

	const post = await prisma.post.create({
		data: {
			userId: data.userId,
			title: data.title,
			description: data.description,
		},
	})

	return post
})
