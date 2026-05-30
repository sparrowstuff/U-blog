import { useUserStore } from '@/stores/userStore'

export default defineNuxtRouteMiddleware(() => {
	const userStore = useUserStore()

	if (!userStore.isReady) {
		return
	}

	if (userStore.isAuthenticated) {
		return navigateTo('/')
	}
})
