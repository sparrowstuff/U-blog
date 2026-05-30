import prisma from '~/server/utils/database'
import { z } from 'zod'

const postSchema = z.object({
	title: z.string().min(1, 'Введите заголовок'),
	description: z.string().min(5, 'Введите пост'),
	userId: z.number().int().positive(),
})

export default defineEventHandler(async event => {
	const body = await readBody(event)

	const parsed = postSchema.safeParse(body)

	if (!parsed.success) {
		const fieldErrors: Record<string, string> = {}

		for (const issue of parsed.error.issues) {
			const key = String(issue.path[0] ?? 'form')
			fieldErrors[key] = issue.message
		}

		throw createError({
			statusCode: 400,
			statusMessage: 'Validation Error',
			data: { fieldErrors },
		})
	}

	const { title, description, userId } = parsed.data

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

	const post = await prisma.post.create({
		data: {
			title,
			description,
			user: {
				connect: {
					id: userId,
				},
			},
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
	})

	return post
})
