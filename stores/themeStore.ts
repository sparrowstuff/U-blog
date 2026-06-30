import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Theme } from '@/types/Theme'

export const useThemeStore = defineStore('theme', () => {
	const theme = ref<Theme>('system')
	const isReady = ref(false)

	const getSystemTheme = (): Exclude<Theme, 'system'> => {
		if (process.server) return 'dark'

		return window.matchMedia('(prefers-color-scheme: dark)').matches
			? 'dark'
			: 'light'
	}

	const resolvedTheme = computed<Exclude<ThemeMode, 'system'>>(() => {
		return theme.value === 'system' ? getSystemTheme() : theme.value
	})

	const applyTheme = () => {
		if (process.server) return

		const value = resolvedTheme.value
		document.documentElement.dataset.theme = value
		document.documentElement.style.colorScheme = value
		isReady.value = true
	}

	const initTheme = () => {
		if (process.server) return

		const savedTheme = localStorage.getItem('theme') as Theme | null

		if (
			savedTheme === 'light' ||
			savedTheme === 'dark' ||
			savedTheme === 'system'
		) {
			theme.value = savedTheme
		}

		applyTheme()
	}

	const setTheme = (value: Theme) => {
		theme.value = value

		if (process.client) {
			localStorage.setItem('theme', value)
		}

		applyTheme()
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
