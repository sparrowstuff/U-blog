import type { H3Event } from 'h3'
import { createError, deleteCookie, useSession } from 'h3'

const SESSION_NAME = 'auth_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 3 // 3 days

interface AuthSession {
	userId?: number
}

const getSessionConfig = (event: H3Event) => {
	const config = useRuntimeConfig()

	const secret = String(config.authCookieSecret || '')

	if (secret.length < 32) {
		throw createError({
			statusCode: 500,
			statusMessage: 'Auth cookie secret is not set or too short',
		})
	}

	return {
		name: SESSION_NAME,
		password: secret,
		maxAge: SESSION_MAX_AGE,
		sessionHeader: false as const,
		cookie: {
			httpOnly: true,
			sameSite: 'lax' as const,
			secure: process.env.NODE_ENV === 'production',
			path: '/',
			maxAge: SESSION_MAX_AGE,
		},
	}
}

export const setAuthCookie = async (event: H3Event, userId: number) => {
	const session = await useSession<AuthSession>(event, getSessionConfig(event))

	await session.update({ userId })

	// Удаляем старый неподписанный cookie после перехода
	deleteCookie(event, 'userId', {
		path: '/',
	})
}

export const getOptionalUserId = async (
	event: H3Event,
): Promise<number | null> => {
	const session = await useSession<AuthSession>(event, getSessionConfig(event))

	const userId = Number(session.data.userId)

	if (!Number.isInteger(userId) || userId <= 0) {
		return null
	}

	return userId
}

export const requireUserId = async (event: H3Event): Promise<number> => {
	const userId = await getOptionalUserId(event)

	if (!userId) {
		throw createError({
			statusCode: 401,
			statusMessage: 'Unauthorized',
		})
	}

	return userId
}

export const clearAuthCookie = async (event: H3Event) => {
	const session = await useSession<AuthSession>(event, getSessionConfig(event))

	await session.clear()

	// Удаляем старый cookie, если он остался в браузере
	deleteCookie(event, 'userId', {
		path: '/',
	})
}
