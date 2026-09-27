export type RateLimitBucket = {
	count: number
	resetAt: number
}

export type RateLimitOptions = {
	key: string
	limit: number
	windowMs: number
}
