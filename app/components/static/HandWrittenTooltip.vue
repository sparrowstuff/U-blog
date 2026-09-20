<template>
	<article class="tooltip">
		<span class="tooltip__text">{{ props.text }}</span>
	</article>
</template>

<script setup lang="ts">
const props = defineProps<{
	text: string
}>()
</script>

<style scoped lang="scss">
@import '@/assets/styles/global/variables';

.tooltip {
	border: 1px solid var(--border);
	border-radius: 0.5rem;
	padding: 0.3rem 0.3rem 0.2rem 0.3rem;
	background: var(--bg);
	display: flex;
	align-items: center;
	justify-content: center;
	opacity: 0;
	transform: translateY(-0.2rem);
	z-index: 5;
	pointer-events: none;

	transition:
		opacity $transition-300,
		transform $transition-300;

	&__text {
		color: var(--text);
		font-size: 0.5rem;
		text-align: center;
	}
}
</style>
