import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Theme } from '@/types/Theme'

const isTheme = (value: string): value is Theme => {
	return value === 'light' || value === 'dark' || value === 'system'
}

export const useThemeStore = defineStore('theme', () => {
	/* Cookie доступна и серверу, и браузеру */
	const themeCookie = useCookie<Theme>('theme', {
		default: () => 'system',
		path: '/',
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 365,
	})

	const initialTheme: Theme = isTheme(themeCookie.value)
		? themeCookie.value
		: 'system'

	const theme = ref<Theme>(initialTheme)
	const isReady = ref(false)

	const getSystemTheme = (): Exclude<Theme, 'system'> => {
		if (import.meta.server) {
			return 'dark'
		}

		return window.matchMedia('(prefers-color-scheme: dark)').matches
			? 'dark'
			: 'light'
	}

	const resolvedTheme = computed<Exclude<Theme, 'system'>>(() => {
		return theme.value === 'system' ? getSystemTheme() : theme.value
	})

	const applyTheme = () => {
		if (import.meta.server) return

		// const value = resolvedTheme.value

		// document.documentElement.dataset.theme = value
		// document.documentElement.style.colorScheme = value

		isReady.value = true
	}

	const initTheme = () => {
		if (import.meta.server) return

		const savedLocalTheme = localStorage.getItem('theme')

		if (isTheme(savedLocalTheme) && !isTheme(themeCookie.value)) {
			theme.value = savedLocalTheme
			themeCookie.value = savedLocalTheme
		} else if (isTheme(themeCookie.value)) {
			theme.value = themeCookie.value
		}

		applyTheme()
	}

	const setTheme = (value: Theme) => {
		theme.value = value
		themeCookie.value = value

		/** Можно временно оставить для совместимости,но основным источником теперь является cookie.*/
		if (import.meta.client) {
			localStorage.setItem('theme', value)
		}

		// applyTheme()
		isReady.value = true
	}

	const toggleTheme = () => {
		setTheme(resolvedTheme.value === 'dark' ? 'light' : 'dark')
	}

	return {
		theme,
		isReady,
		resolvedTheme,
		getSystemTheme,
		initTheme,
		setTheme,
		toggleTheme,
		applyTheme,
	}
})
