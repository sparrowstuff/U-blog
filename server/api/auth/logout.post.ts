import { deleteCookie } from 'h3'

export default defineEventHandler(async event => {
	deleteCookie(event, 'userId', {
		path: '/',
	})

	return { success: true }
})
