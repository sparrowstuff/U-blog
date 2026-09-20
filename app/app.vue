<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from '~/stores/userStore'
import { useThemeStore } from '~/stores/themeStore'
import { useCookieStore } from '~/stores/cookieStore'

const userStore = useUserStore()
const themeStore = useThemeStore()
const cookieStore = useCookieStore()

useHead(() => ({
	title: 'U-Blog',
	meta: [
		{
			name: 'description',
			content: `U-blog - write everything what's on your mind today`,
		},
	],
	htmlAttrs: {
		'data-theme': themeStore.resolvedTheme,
		style: 'color-scheme: ${themeStore.resolvedTheme};',
	},
}))

onMounted(async () => {
	// themeStore.initTheme()

	cookieStore.loadCookieStatus()

	try {
		await userStore.fetchUser()
	} catch (error: any) {
		console.error('Error fetching user:', error)
	}
})

// вместо onMounted - callOnce для однократного вызова
// callOnce('user', async () => {
// 	await userStore.fetchUser()
// 	console.log('user fetched')
// })
</script>

<style lang="scss" scoped>
@import '../assets/styles/global/variables';

.test {
	&__title {
		color: var(--text-muted);
	}
}
</style>
