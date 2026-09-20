<template>
	<main>
		<section class="hero" v-if="!isLoading">
			<div class="container">
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
				<Transition class="hero__add-post-transition" name="post-form">
					<AddPostForm v-if="showAddPostForm" />
				</Transition>
			</div>
			<UpBtn />
		</section>
		<LoaderImg v-else />
		<!-- <PostComponent
			v-for="post in mostLikedPosts"
			:key="post.id"
			:post="post"
			:show-comments-immediately="false"
		>
		</PostComponent> -->
	</main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

import UpBtn from '../components/static/UpBtn.vue'
import SidebarComponent from '../components/static/SidebarComponent.vue'
import typeWriter from '@/utils/typeWriter.js'
import AddPostForm from '../components/static/AddPostForm.vue'
import LoaderImg from '../components/static/LoaderImg.vue'
import { usePostsStore } from '@/stores/postsStore'
import PostComponent from '../components/static/PostComponent.vue'

const typeWrittenMessage1 = ref('')
const typeWrittenMessage2 = ref('')
const isLoading = ref(false)

const showAddPostForm = ref(false)

onMounted(() => {
	isLoading.value = true
	typeWriter('площадка для всего, что у вас на уме...', value => {
		typeWrittenMessage1.value = value
	})

	setTimeout(() => {
		typeWriter('no one is gonna be offended...', value => {
			typeWrittenMessage2.value = value
		})
	}, 2)

	showAddPostForm.value = true
	isLoading.value = false
})

onUnmounted(() => {
	typeWrittenMessage1.value = ''
	typeWrittenMessage2.value = ''
	showAddPostForm.value = false
	isLoading.value = false
})

useSeoMeta({
	title: 'U-blog',
	description: 'Платформа для публикации и чтения постов.',
	ogTitle: 'U-blog',
	ogDescription: 'Платформа для публикации и чтения постов.',
	ogType: 'website',
	twitterCard: 'summary_large_image',
	twitterTitle: 'U-blog',
	twitterDescription: 'Платформа для публикации и чтения постов.',
	twitterImage: '/images/preview-home.jpg',
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/global/variables.scss';

.hero {
	margin-bottom: 1.12rem;

	&__title {
		text-align: center;
		margin-bottom: 1rem;
		color: var(--text);

		@media (max-width: 48rem) {
			font-size: $px-22;
		}
	}

	&__main {
		display: grid;
		grid-template-columns: 0.5fr 1fr;
		gap: 1rem;

		margin-bottom: 1.12rem;

		@media (max-width: 48rem) {
			margin-bottom: 0.5rem;
		}
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
		color: var(--text);

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
		color: var(--text-muted);

		opacity: 0;
		pointer-events: none;

		animation: textShowUp 1s ease-in 2s forwards;
	}

	&__blog-link {
		color: var(--accent);

		transition: color $transition-300;

		&:hover,
		&:focus-visible {
			color: $blue;
			color: var(--link);
		}
	}

	&__additional-text {
		font-size: $px-14;
		line-height: 110%;
		font-weight: 300;
		text-align: right;
		color: var(--text-muted);

		@media (max-width: 25rem) {
			text-align: center;
		}
	}

	.post-form-enter-active {
		transition:
			opacity $transition-300,
			transform $transition-300;
	}

	.post-form-leave-active {
		transition:
			opacity $transition-300,
			transform $transition-300;
	}

	.post-form-enter-from,
	.post-form-leave-to {
		opacity: 0;
		transform: translateX(-2.5rem);
	}

	.post-form-enter-to,
	.post-form-leave-from {
		opacity: 1;
		transform: translateX(0);
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
