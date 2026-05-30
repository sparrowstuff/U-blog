import prisma from '~/server/utils/database'

export default defineEventHandler(async () => {
	const posts = await prisma.post.findMany({
		orderBy: {
			createdAt: 'desc',
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
			comments: true,
		},
	})

	return posts
})
