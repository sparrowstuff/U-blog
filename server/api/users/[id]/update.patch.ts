import prisma from '~/server/utils/database'
import { requireUserId } from '~/server/utils/auth'
import { z } from 'zod'

const updateUserSchema = z
	.object({
		name: z
			.string()
			.trim()
			.min(2, 'Имя должно быть минимум 2 символа')
			.optional(),

		surName: z
			.string()
			.trim()
			.min(2, 'Фамилия должна быть не короче 2 символов')
			.optional(),
	})
	.refine(data => data.name !== undefined || data.surName !== undefined, {
		message: 'Необходимо передать хотя бы одно поле для обновления',
	})

export default defineEventHandler(async event => {
	const paramId = Number(getRouterParam(event, 'id'))

	if (!Number.isInteger(paramId) || paramId <= 0) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid user id',
		})
	}

	const currentUserId = await requireUserId(event)

	if (currentUserId !== paramId) {
		throw createError({
			statusCode: 403,
			statusMessage: 'Forbidden',
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

	const user = await prisma.user.findUnique({
		where: { id: currentUserId },
		select: { id: true },
	})

	if (!user) {
		throw createError({
			statusCode: 404,
			statusMessage: 'User not found',
		})
	}

	const updatedUser = await prisma.user.update({
		where: { id: currentUserId },
		data: parsed.data,
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
