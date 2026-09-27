import { createError, getRequestIP, setResponseHeader } from 'h3'
import type { H3Event } from 'h3'
import type { RateLimitBucket, RateLimitOptions } from '@/types/RateLimitBucket'

const buckets = new Map<string, RateLimitBucket>()

const cleanupExpiredBuckets = (now: number) => {
	for (const [key, bucket] of buckets) {
		if (bucket.resetAt <= now) {
			buckets.delete(key)
		}
	}
}

export const getClientIp = (event: H3Event) => {
	const config = useRuntimeConfig()

	const trustProxy = String(config.trustProxy ?? '').toLowerCase() === 'true'

	return (
		getRequestIP(event, {
			xForwardedFor: trustProxy,
		}) ?? 'unknown'
	)
}

export const createRateLimitKey = (...parts: Array<string | number>) => {
	return parts.map(part => String(part).trim().toLowerCase()).join(':')
}

export const enforceRateLimit = (event: H3Event, options: RateLimitOptions) => {
	const now = Date.now()

	cleanupExpiredBuckets(now)

	const bucket = buckets.get(options.key)

	if (!bucket || bucket.resetAt <= now) {
		buckets.set(options.key, {
			count: 1,
			resetAt: now + options.windowMs,
		})

		return
	}

	if (bucket.count >= options.limit) {
		const retryAfterSeconds = Math.max(
			1,
			Math.ceil((bucket.resetAt - now) / 1000),
		)

		setResponseHeader(event, 'Retry-After', retryAfterSeconds)

		throw createError({
			statusCode: 429,
			statusMessage: 'Too Many Requests',
			data: {
				retryAfterSeconds,
			},
		})
	}
	bucket.count += 1
}
