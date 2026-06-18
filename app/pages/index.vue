<template>
	<section class="hero">
		<div class="container">
			<h1 class="hero__title">Hello bloggers</h1>
			<div class="hero__main">
				<SidebarComponent />
				<div class="hero__wrapper">
					<h2 class="hero__additional-title">
						Это площадка для всего что у вас на уме сегодня...
					</h2>
					<p class="hero__additional-middle">
						изложите свои мысли на странице
						<NuxtLink
							class="hero__blog-link"
							aria-label="Переход на страницу блога"
							:to="'/blog'"
							>Блога</NuxtLink
						>
					</p>
					<p class="hero__additional-text">no one is gonna be offended...</p>
				</div>
			</div>
			<div class="hero__additional"></div>
		</div>
		<UpBtn />
	</section>
</template>

<script setup lang="ts">
import UpBtn from '../components/static/UpBtn.vue'
import SidebarComponent from '../components/static/SidebarComponent.vue'
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
	}

	&__additional-title {
		font-size: $px-18;
		line-height: 110%;
		font-weight: 400;
		text-align: left;
	}

	&__additional-middle {
		font-size: $px-16;
		line-height: 110%;
		font-weight: 400;
		text-align: center;
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
	}
}
</style>
