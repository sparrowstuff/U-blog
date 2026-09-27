import prisma from '~/server/utils/database'
import { clearAuthCookie, requireUserId } from '~/server/utils/auth'
import {
	createRateLimitKey,
	enforceRateLimit,
	getClientIp,
} from '~/server/utils/rate-limiter'

const ACCOUNT_DELETE_IP_LIMIT = 10
const ACCOUNT_DELETE_USER_LIMIT = 3
const ACCOUNT_DELETE_WINDOW_MS = 24 * 60 * 60 * 1000

export default defineEventHandler(async event => {
	const clientIp = getClientIp(event)

	enforceRateLimit(event, {
		key: createRateLimitKey('account-delete', 'ip', clientIp),
		limit: ACCOUNT_DELETE_IP_LIMIT,
		windowMs: ACCOUNT_DELETE_WINDOW_MS,
	})

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

	enforceRateLimit(event, {
		key: createRateLimitKey('account-delete', 'user', currentUserId),
		limit: ACCOUNT_DELETE_USER_LIMIT,
		windowMs: ACCOUNT_DELETE_WINDOW_MS,
	})

	const deleted = await prisma.user.deleteMany({
		where: {
			id: currentUserId,
		},
	})

	if (deleted.count === 0) {
		throw createError({
			statusCode: 404,
			statusMessage: 'User not found',
		})
	}

	await clearAuthCookie(event)

	return {
		success: true,
	}
})
