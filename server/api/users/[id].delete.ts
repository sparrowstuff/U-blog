import prisma from '~/server/utils/database'

export default defineEventHandler(async event => {
	const userId = Number(getRouterParam(event, 'id'))

	if (!userId || Number.isNaN(id)) {
		throw createError({ statusCode: 400, statusMessage: 'Invalid user id' })
	}

	await prisma.user.delete({
		where: { id: userId },
	})

	return { success: true }
})
