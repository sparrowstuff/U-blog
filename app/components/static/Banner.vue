<template>
	<article class="banner">
		<img
			class="banner__image"
			src="/images/chat-banner-edited.jpg"
			alt="Баннер чата"
			width="3000"
			height="200"
		/>
	</article>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
@import '@/assets/styles/global/variables';

.banner {
	width: 100%;

	&__image {
		overflow: hidden;
		object-fit: cover;
		// width: 100%;
		// height: 30%;
	}
}
</style>
