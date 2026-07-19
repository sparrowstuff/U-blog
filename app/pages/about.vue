<template>
	<section class="about">
		<div class="container">
			<h2 class="about__title">{{ typeWrittenMessage }}</h2>
			<div
				class="about__wrapper glow-block"
				:style="glowStyle"
				@pointermove="onMove"
				@pointerleave="onLeave"
				@pointerenter="onEnter"
			>
				<div class="glow-block__glow"></div>
				<ul class="about-list glow-block__content">
					<li class="about-list__item about-list__item--xxl">
						<a href="https://nuxt.com/" target="blank" class="about-list__link">
							<img
								src="/images/tech/Nuxt-js-logo.png"
								alt="Nuxt-logo"
								class="about-list__image"
							/>
							<span class="about-list__link-text">Nuxt.js</span></a
						>
					</li>
					<li class="about-list__item about-list__item--xxl">
						<a
							href="https://vuejs.org/"
							target="blank"
							class="about-list__link"
						>
							<img
								src="/images/tech/vue-logo.svg"
								alt="Nuxt-logo"
								class="about-list__image"
							/>
							<span class="about-list__link-text">Vue.js</span></a
						>
					</li>
					<li class="about-list__item about-list__item--xxl">
						<a
							href="https://pinia.vuejs.org/"
							target="blank"
							class="about-list__link"
						>
							<img
								src="/images/tech/Pinia-logo.svg"
								alt="Pinia-logo"
								class="about-list__image"
							/>
							<span class="about-list__link-text">Pinia</span></a
						>
					</li>
					<li class="about-list__item">
						<a
							href="https://nodejs.org/en"
							target="blank"
							class="about-list__link"
						>
							<img
								src="/images/tech/Node.js-logo.webp"
								alt="node.js-logo"
								class="about-list__image"
							/>
							<span class="about-list__link-text">Node.js</span></a
						>
					</li>
					<li class="about-list__item">
						<a
							href="https://router.vuejs.org/"
							target="blank"
							class="about-list__link"
						>
							<img
								src="/images/tech/vue-logo.svg"
								alt="Vue-logo"
								class="about-list__image"
							/>
							<span class="about-list__link-text">Vue-Router</span></a
						>
					</li>
					<li class="about-list__item">
						<a
							href="http://vueuse.org/"
							target="blank"
							class="about-list__link"
						>
							<img
								src="/images/tech/vue-use-logo.svg"
								alt="vue-use-logo"
								class="about-list__image"
							/>
							<span class="about-list__link-text">Vueuse</span></a
						>
					</li>
					<li class="about-list__item">
						<a
							href="https://sass-lang.com/"
							target="blank"
							class="about-list__link"
						>
							<img
								src="/images/tech/sass-logo.svg"
								alt="scss-logo"
								class="about-list__image"
							/>
							<span class="about-list__link-text">SCSS/SASS</span></a
						>
					</li>
					<li class="about-list__item about-list__item--xxl">
						<a
							href="https://www.postgresql.org/"
							target="blank"
							class="about-list__link"
						>
							<img
								src="/images/tech/pg-admin-logo.png"
								alt="PostrgeSQL-logo"
								class="about-list__image"
							/>
							<span class="about-list__link-text">PostrgeSQL</span></a
						>
					</li>
					<li class="about-list__item">
						<a
							href="https://www.prisma.io/"
							target="blank"
							class="about-list__link"
						>
							<img
								src="/images/tech/prisma-logo.png"
								alt="Nuxt-logo"
								class="about-list__image"
							/>
							<span class="about-list__link-text">Prisma</span></a
						>
					</li>
					<li class="about-list__item">
						<a
							href="https://www.pgadmin.org/"
							target="blank"
							class="about-list__link"
						>
							<img
								src="/images/tech/pg-admin-logo.png"
								alt="pg-admin-logo"
								class="about-list__image"
							/>
							<span class="about-list__link-text">Pg Admin</span></a
						>
					</li>
					<li class="about-list__item">
						<a
							href="https://www.npmjs.com/package/bcrypt"
							target="blank"
							class="about-list__link"
						>
							<img
								src="/images/tech/bcrypt-logo.png"
								alt="bcrypt-logo"
								class="about-list__image"
							/>
							<span class="about-list__link-text">Bcrypt</span></a
						>
					</li>
					<li class="about-list__item">
						<a href="https://zod.dev/" target="blank" class="about-list__link">
							<img
								src="/images/tech/zod-logo.webp"
								alt="zod-logo"
								class="about-list__image"
							/>
							<span class="about-list__link-text">Zod</span></a
						>
					</li>
				</ul>
			</div>

			<p class="about__learn-terms">
				Для ознакомления с правилами площадки перейдите на
				<NuxtLink
					class="about__link"
					:to="'/privacy'"
					aria-label="Правила платформы"
					>Правила приватности</NuxtLink
				>
				/
				<NuxtLink
					class="about__link"
					:to="'/terms'"
					aria-label="Правила площадки"
					>Правила площадки</NuxtLink
				>
			</p>
		</div>
	</section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import typeWriter from '~/utils/typeWriter'

const typeWrittenMessage = ref('')

const x = ref(50)
const y = ref(50)

const isVisible = ref(false)

const glowStyle = computed(() => ({
	'--x': `${x.value}px`,
	'--y': `${y.value}px`,
	'--opacity': isVisible.value ? 1 : 0,
}))

const onMove = (e: PointerEvent) => {
	const el = e.currentTarget as HTMLElement
	const rect = el.getBoundingClientRect()

	x.value = e.clientX - rect.left
	y.value = e.clientY - rect.top
}

const onEnter = () => {
	isVisible.value = true
}

const onLeave = () => {
	isVisible.value = false
}

useHead({
	title: 'U-blog about page',
	meta: [{ name: 'description', content: 'U-blog tech used page' }],
})

onMounted(() => {
	typeWriter('Данный проект реализован с помощью:', value => {
		typeWrittenMessage.value = value
	})
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/global/variables';

.about {
	margin-bottom: 1.12rem;

	&__wrapper {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 0.3rem 0 0.3rem 0;
	}

	&__title {
		text-align: center;
		color: var(--text);
		margin-bottom: 1.12rem;
		height: 2rem;

		@media (max-width: 48rem) {
			font-size: $px-22;
			margin-bottom: 0.5rem;
			height: 3rem;
		}
	}

	&__learn-terms {
		font-size: $px-20;
		line-height: 110%;
		text-align: center;
		margin-top: 2rem;
		margin-bottom: 2rem;

		@media (max-width: 37.5rem) {
			margin-top: 1rem;
			margin-bottom: 1rem;
			font-size: $px-16;
		}
	}

	&__link {
		transition: color $transition-300;

		&:hover,
		&:focus-visible,
		&:focus-within {
			color: $apple;
		}
	}
}

.about-list {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 1rem;

	$root: &;
	opacity: 0;

	animation: LinksMenuAppearanceDown 1s ease-in 1s forwards;

	@media (max-width: 40rem) {
		grid-template-columns: repeat(2, 1fr);
	}

	&__item {
		height: 7rem;
		position: relative;
		overflow: hidden;
		border-radius: 0.5rem;
		border: 1px solid var(--border);

		transition: transform $transition-300;

		&:hover .about-list__link-text,
		&:focus-visible .about-list__link-text,
		&:focus-within .about-list__link-text {
			opacity: 1;
			transform: translateY(0);
		}

		&:hover .about-list__image {
			scale: 1.05;
		}

		&--xxl {
			grid-column: span 2;

			@media (max-width: 31.25rem) {
				grid-column: unset;
			}
		}
	}

	&__link {
		width: 100%;
		height: 100%;
	}

	&__link-text {
		position: absolute;
		bottom: 4%;
		right: 2%;
		display: block;
		width: fit-content;
		background-color: $white-grey;
		color: $purple-deep;
		border-radius: 0.25rem;
		padding: 0.2rem 0.2rem 0.2rem 0.2rem;
		font-size: $px-22;
		line-height: 110%;
		opacity: 0;
		transform: translateY(1rem);

		@media (max-width: 31.25rem) {
			opacity: 1;
			transform: translateY(0);
		}

		transition:
			color $transition-300,
			opacity $transition-300,
			transform $transition-300;
	}

	&__image {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
		object-position: center;
		transition: scale $transition-300;
	}
}

.glow-block {
	position: relative;
	overflow: hidden;
	border-radius: 0.5rem;

	&__glow {
		position: absolute;
		inset: 0;
		pointer-events: none;
		opacity: var(--opacity);
		transition: opacity $transition-300;
		background: radial-gradient(
			220px circle at var(--x) var(--y),
			var(--mouse-move-first),
			var(--mouse-move-second),
			transparent 60%
		);
	}
}

@keyframes LinksMenuAppearanceDown {
	0% {
		opacity: 0;
		clip-path: polygon(0% 0%, 0% 0%, 100% 0%, 100% 0%);
	}

	100% {
		opacity: 1;
		clip-path: polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%);
	}
}
</style>
