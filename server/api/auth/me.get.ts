import prisma from '~/server/utils/database'
import { getCookie } from 'h3'

export default defineEventHandler(async event => {
	const userId = getCookie(event, 'userId')

	if (!userId) return null

	const user = await prisma.user.findUnique({
		where: { id: Number(userId) },
		select: {
			id: true,
			name: true,
			surName: true,
			email: true,
			createdAt: true,
			isAdmin: true,
		},
	})

	return user
})
