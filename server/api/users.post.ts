import prisma from '../utils/database'
import { z } from 'zod'
import bcrypt from 'bcrypt'

const userSchema = z.object({
	name: z.string().min(2),
	surName: z.string().min(2),
	email: z.string().email(),
	password: z.string().min(6),
})

export default defineEventHandler(async event => {
	const body = await readBody(event)
	const data = userSchema.parse(body)

	const existingUser = await prisma.user.findUnique({
		where: { email: data.email },
	})

	if (existingUser) {
		throw createError({
			statusCode: 409,
			statusMessage: 'User already exists',
		})
	}

	const hashedPassword = await bcrypt.hash(data.password, 10)

	const user = await prisma.user.create({
		data: {
			name: data.name,
			surName: data.surName,
			email: data.email,
			password: hashedPassword,
		},
	})

	return {
		id: user.id,
		name: user.name,
		surName: user.surName,
		email: user.email,
		createdAt: user.createdAt,
		isAdmin: user.isAdmin,
	}
})
