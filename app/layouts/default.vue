<template>
	<section class="default">
		<HeaderComponent />
		<slot />
		<CookieBanner />
		<FooterComponent />
	</section>
</template>

<script setup lang="ts">
import HeaderComponent from '../components/static/HeaderComponent.vue'
import FooterComponent from '../components/static/FooterComponent.vue'
import CookieBanner from '../components/static/CookieBanner.vue'
</script>

<style scoped lang="scss">
@import '../../assets/styles/global/variables';

.default {
	margin-top: unset;
	margin-bottom: unset;
	display: flex;
	flex-direction: column;
	min-height: 100dvh;
}
</style>
