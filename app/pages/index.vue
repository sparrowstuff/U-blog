<template>
	<section class="hero">
		<div class="container">
			<!-- <h1 class="hero__title">Hello bloggers</h1> -->
			<div class="hero__main">
				<SidebarComponent />
				<div class="hero__wrapper">
					<h1 class="hero__additional-title">
						<b>U-blog</b> - {{ typeWrittenMessage1 }}
					</h1>
					<p class="hero__additional-middle">
						изложите свои мысли на странице
						<NuxtLink
							class="hero__blog-link"
							aria-label="Переход на страницу блога"
							:to="'/blog'"
							>Блога</NuxtLink
						>
					</p>
					<p class="hero__additional-text">{{ typeWrittenMessage2 }}</p>
				</div>
			</div>
			<div class="hero__additional"></div>
		</div>
		<UpBtn />
	</section>
	<Banner />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

import UpBtn from '../components/static/UpBtn.vue'
import SidebarComponent from '../components/static/SidebarComponent.vue'
import typeWriter from '@/utils/typeWriter.js'
import Banner from '../components/static/Banner.vue'

const typeWrittenMessage1 = ref('')
const typeWrittenMessage2 = ref('')

onMounted(() => {
	typeWriter('площадка для всего, что у вас на уме...', value => {
		typeWrittenMessage1.value = value
	})

	setTimeout(() => {
		typeWriter('no one is gonna be offended...', value => {
			typeWrittenMessage2.value = value
		})
	}, 2)
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/global/variables.scss';

.hero {
	margin-bottom: 1.12rem;

	&__title {
		text-align: center;
		margin-bottom: 1rem;

		@media (max-width: 48rem) {
			font-size: $px-22;
		}
	}

	&__main {
		display: grid;
		grid-template-columns: 0.5fr 1fr;
		gap: 1rem;
	}

	&__wrapper {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 0.5rem;

		@media (max-width: 48rem) {
			grid-column: span 2;
		}

		@media (max-width: 25rem) {
			align-items: center;
		}
	}

	&__additional-title {
		font-size: $px-18;
		line-height: 110%;
		font-weight: 400;
		text-align: left;

		@media (max-width: 25rem) {
			text-align: center;
			text-orientation: sideways;
		}
	}

	&__additional-middle {
		font-size: $px-22;
		line-height: 110%;
		font-weight: 400;
		text-align: center;

		opacity: 0;
		pointer-events: none;

		animation: textShowUp 1s ease-in 2s forwards;
	}

	&__blog-link {
		color: $apple;

		transition: color $transition-300;

		&:hover,
		&:focus-visible {
			color: $blue;
		}
	}

	&__additional-text {
		font-size: $px-14;
		line-height: 110%;
		font-weight: 300;
		text-align: right;

		@media (max-width: 25rem) {
			text-align: center;
		}
	}
}

@keyframes textShowUp {
	from {
		opacity: 0;
		pointer-events: none;
	}

	to {
		opacity: 1;
		pointer-events: all;
	}
}
</style>
