import { useUserStore } from '@/stores/userStore'

export default defineNuxtRouteMiddleware(async () => {
	const userStore = useUserStore()

	if (!userStore.isReady) {
		await userStore.fetchUser()
	}

	if (!userStore.isAuthenticated) {
		return navigateTo('/')
	}
})
