<template>
	<HeaderComponent />
	<slot />
</template>

<script setup lang="ts">
import HeaderComponent from '../components/static/HeaderComponent.vue'
</script>

<style scoped lang="scss">
@import '../../assets/styles/global/variables';

.hero {
	margin-top: 1rem;
	margin-bottom: 1rem;
	height: 100dvh;

	&__wrapper {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.62rem;
	}
}
</style>
