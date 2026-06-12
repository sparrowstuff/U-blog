import prisma from '~/server/utils/database'
import { getCookie } from 'h3'
import { z } from 'zod'

const updateUserSchema = z.object({
	name: z.string().min(2, 'Имя должно быть минимум 2 символа'),
	surName: z.string().min(2, 'Фамилия должна быть не короче 2 символов'),
	avatarUrl: z.string().nullable().optional(),
})

export default defineEventHandler(async event => {
	const paramId = Number(getRouterParam(event, 'id'))
	const cookieUserId = Number(getCookie(event, 'userId'))

	if (!paramId || Number.isNaN(paramId)) {
		throw createError({ statusCode: 400, statusMessage: 'Invalid user id' })
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
			statusMessage: 'user not found',
		})
	}

	const body = await readBody(event)
	const parsed = updateUserSchema.safeParse(body)

	if (!parsed.success) {
		const fieldErrors: Record<string, string> = {}

		for (const issue of parsed.error.issues) {
			const key = String(issue.path[0] ?? 'form')
			fieldErrors[key] = issue.message
		}

		throw createError({
			statusCode: 400,
			statusMessage: 'Validation error',
			data: { fieldErrors },
		})
	}

	const updatedUser = await prisma.user.update({
		where: { id: paramId },
		data: {
			name: parsed.data.name,
			surName: parsed.data.surName,
			avatarUrl: parsed.data.avatarUrl ?? null,
		},
		select: {
			id: true,
			name: true,
			surName: true,
			email: true,
			createdAt: true,
			isAdmin: true,
			avatarUrl: true,
		},
	})

	return updatedUser
})
