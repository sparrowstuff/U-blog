import { readMultipartFormData, getRouterParam, createError } from 'h3'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'

export default defineEventHandler(async event => {
	const userId = Number(getRouterParam(event, 'id'))

	if (!userId || Number.isNaN(userId)) {
		throw createError({ statusCode: 400, statusMessage: 'Invalid user id' })
	}

	const formData = await readMultipartFormData(event)
	const file = formData?.find(item => item.name === 'file')

	if (!file?.data || !file.filename) {
		throw createError({ statusCode: 400, statusMessage: 'File is required' })
	}

	const uploadsDir = join(process.cwd(), 'public', 'uploads')
	await mkdir(uploadsDir, { recursive: true })

	const ext = file.filename.split('.').pop() || 'jpg'
	const fileName = `user-${userId}-${randomUUID()}.${ext}`
	const filePath = join(uploadsDir, fileName)

	await writeFile(filePath, file.data)

	return {
		avatarUrl: `/uploads/${fileName}`,
	}
})
