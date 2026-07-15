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

useHead({
	title: 'You-Blog',
})

onMounted(async () => {
	await userStore.fetchUser()

	themeStore.initTheme()

	cookieStore.loadCookieStatus()
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
		// color: $primary;
		color: var(--text-muted);
	}
}
</style>
