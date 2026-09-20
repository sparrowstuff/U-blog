import prisma from '~/server/utils/database'
import { requireUserId } from '~/server/utils/auth'
import { z } from 'zod'

// const postSchema = z.object({
// 	title: z.string().min(1, 'Введите заголовок'),
// 	description: z.string().min(5, 'Введите пост'),
// 	// userId: z.number().int().positive(),
// })

const postSchema = z.object({
	title: z.string().trim().min(1, 'Введите заголовок'),
	description: z.string().trim().min(5, 'Введите пост'),
})

export default defineEventHandler(async event => {
	const userId = await requireUserId(event)
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

	return prisma.post.create({
		data: {
			title: parsed.data.title,
			description: parsed.data.description,
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