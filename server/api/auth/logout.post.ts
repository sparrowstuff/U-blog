// import { deleteCookie } from 'h3'
import { clearAuthCookie } from '~/server/utils/auth'

export default defineEventHandler(async event => {
	await clearAuthCookie(event)

	return { success: true }
})
