import prisma from '~/server/utils/database'
import { requireUserId } from '~/server/utils/auth'

import { readMultipartFormData, getRouterParam, createError } from 'h3'
import { mkdir, unlink, writeFile } from 'node:fs/promises'
import { join, basename } from 'node:path'
import { randomUUID } from 'node:crypto'

import sharp from 'sharp'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 mb
const MAX_INPUT_PIXELS = 25_000_000
const AVATAR_SIZE = 512

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

const ALLOWED_IMAGE_FORMATS = new Set(['jpeg', 'png', 'webp', 'HEIC'])

const getUploadsDirectory = () => {
	return join(process.cwd(), 'public', 'uploads')
}

const getManagedAvatarUrl = (
	avatarUrl: string | null,
	userId: number,
): string | null => {
	if (!avatarUrl) return null

	const expectedPrefix = `/uploads/user-${userId}-`

	if (!avatarUrl.startsWith(expectedPrefix)) {
		return null
	}

	const fileName = basename(avatarUrl)

	if (!fileName.startsWith(`user-${userId}-`)) {
		return null
	}

	return join(getUploadsDirectory(), fileName)
}

const removeFileSafely = async (filePath: string | null) => {
	if (!filePath) return

	try {
		await unlink(filePath)
	} catch (error: any) {
		// ENOENT означает, что файл уже отсутствует.
		if (error?.code !== 'ENOENT') {
			console.error('Failed to remove avatar file:', error)
		}
	}
}

export default defineEventHandler(async event => {
	const userId = await requireUserId(event)
	const paramId = Number(getRouterParam(event, 'id'))

	if (!Number.isInteger(paramId) || paramId <= 0) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid user id',
		})
	}

	if (paramId !== userId) {
		throw createError({
			statusCode: 403,
			statusMessage: 'Forbidden',
		})
	}

	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			id: true,
			avatarUrl: true,
		},
	})

	if (!user) {
		throw createError({
			statusCode: 404,
			statusMessage: 'User not found',
		})
	}

	const formData = await readMultipartFormData(event)

	if (!formData) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Multipart form data is required',
		})
	}

	const fileParts = formData.filter(item => item.name === 'file')

	if (fileParts.length !== 1) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Exactly one avatar file is required',
		})
	}

	const file = fileParts[0]

	if (!file?.data || file.data.length === 0) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Avatar file is empty',
		})
	}

	if (!file.type || !ALLOWED_MIME_TYPES.has(file.type)) {
		throw createError({
			statusCode: 415,
			statusMessage: 'Only JPEG, PNG and WebP images are allowed',
		})
	}

	if (file.data.length > MAX_FILE_SIZE) {
		throw createError({
			statusCode: 413,
			statusMessage: 'Maximum avatar size is 5 MB',
		})
	}

	let avatarBuffer: Buffer

	try {
		const image = sharp(file.data, {
			failOn: 'error',
			limitInputPixels: MAX_INPUT_PIXELS,
			animated: false,
		})

		const metadata = await image.metadata()

		if (!metadata.format || !ALLOWED_IMAGE_FORMATS.has(metadata.format)) {
			throw new Error('Unsupported image format')
		}

		if (!metadata.width || !metadata.height) {
			throw new Error('Image dimensions are missing')
		}

		if (metadata.pages && metadata.pages > 1) {
			throw new Error('Animated images are not allowed')
		}

		avatarBuffer = await image
			.rotate()
			.resize(AVATAR_SIZE, AVATAR_SIZE, {
				fit: 'cover',
				position: 'centre',
				withoutEnlargement: true,
			})
			.webp({
				quality: 82,
				effort: 4,
			})
			.toBuffer()
	} catch {
		throw createError({
			statusCode: 415,
			statusMessage: 'Invalid or corrupted image',
		})
	}

	const uploadsDir = getUploadsDirectory()
	await mkdir(uploadsDir, { recursive: true })

	const fileName = `user-${userId}-${randomUUID()}.webp`

	const filePath = join(uploadsDir, fileName)
	const avatarUrl = `/uploads/${fileName}`

	try {
		await writeFile(filePath, avatarBuffer, {
			flag: 'wx',
		})

		await prisma.user.update({
			where: { id: userId },
			data: { avatarUrl },
		})
	} catch (error) {
		// Если БД не обновилась, новый файл не должен оставаться.
		await removeFileSafely(filePath)
		throw error
	}

	const previousAvatarPath = getManagedAvatarUrl(user.avatarUrl, userId)

	// Старый файл удаляем только после успешного обновления БД.
	if (previousAvatarPath !== filePath) {
		await removeFileSafely(previousAvatarPath)
	}

	return {
		avatarUrl,
	}

	// if (!file?.data || !file.filename) {
	// 	throw createError({ statusCode: 400, statusMessage: 'File is required' })
	// }

	// const uploadsDir = join(process.cwd(), 'public', 'uploads')
	// await mkdir(uploadsDir, { recursive: true })

	// const ext = file.filename.split('.').pop() || 'jpg'
	// const fileName = `user-${userId}-${randomUUID()}.${ext}`
	// const filePath = join(uploadsDir, fileName)

	// await writeFile(filePath, file.data)

	// return {
	// 	avatarUrl: `/uploads/${fileName}`,
	// }
})
