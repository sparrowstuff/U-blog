import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CookieStatus } from '@/types/CookieStatus'

const STORAGE_KEY = 'useCookieAccepted'

export const useCookieStore = defineStore('cookie', () => {
	const status = ref<CookieStatus | null>(null)
	const isReady = ref(false)
	// const isCookieBannerVisible = ref(true)

	const loadCookieStatus = () => {
		if (!import.meta.client) return

		const saved = localStorage.getItem(STORAGE_KEY)

		if (saved === 'accepted' || saved === 'rejected') {
			status.value = saved
			// isCookieBannerVisible.value = false
		} else {
			status.value = null
			// isCookieBannerVisible.value = true
		}

		isReady.value = true
	}

	const acceptCookie = () => {
		status.value = 'accepted'

		if (import.meta.client) {
			localStorage.setItem(STORAGE_KEY, 'accepted')
		}

		// isCookieBannerVisible.value = false
	}

	const rejectCookie = () => {
		status.value = 'rejected'

		if (import.meta.client) {
			localStorage.setItem(STORAGE_KEY, 'rejected')
		}

		// isCookieBannerVisible.value = false
	}

	const clearCookieChoice = () => {
		status.value = null

		if (import.meta.client) {
			localStorage.removeItem(STORAGE_KEY)
		}
	}

	return {
		status,
		isReady,
		// isCookieBannerVisible,
		loadCookieStatus,
		acceptCookie,
		rejectCookie,
		clearCookieChoice,
	}
})
