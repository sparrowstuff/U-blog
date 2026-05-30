<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from '~/stores/userStore'

const userStore = useUserStore()

useHead({
	title: 'You-Blog',
})

onMounted(async () => {
	await userStore.fetchUser()
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
		color: $primary;
	}
}
</style>
