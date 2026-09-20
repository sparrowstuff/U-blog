<template>
	<section class="blog">
		<div class="container">
			<div
				class="blog__heading"
				:class="{ 'blog__heading--center': !userStore.isAuthenticated }"
			>
				<h1 class="blog__title">It's a great time for a post</h1>
				<button
					v-if="userStore.isAuthenticated"
					class="blog__add-post-btn btn btn--transparent"
					type="button"
					aria-label="Написать пост"
					@click="isPosting = !isPosting"
				>
					{{ isPosting ? 'Отменить написание поста' : 'Написать пост' }}
				</button>
			</div>
			<AppPagination
				class="blog__pagination"
				:total-pages="totalPages"
				:current-page="currentPage"
				@update:current-page="changePage"
			/>
			<div class="blog__add-post" v-if="userStore.isAuthenticated">
				<Transition class="blog__form-transition" name="form-wrapper">
					<AddPostForm v-if="isPosting" />
				</Transition>
			</div>
			<div class="blog__main-wrapper">
				<div class="blog__wrapper">
					<div class="blog__content" v-if="!loading">
						<TransitionGroup class="blog__posts" name="post-list" tag="article">
							<PostComponent
								v-for="post in paginatedPosts"
								:key="post.id"
								:post="post"
								:show-comments-immediately="false"
							/>
						</TransitionGroup>
					</div>
					<LoaderImg v-else />
				</div>

				<div class="blog__most-liked-wrapper">
					<MostLikedPostsCard
						v-for="post in mostLikedPosts"
						:post="post"
						:key="post.id"
					/>
				</div>
			</div>
		</div>
		<UpBtn />
	</section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import PostComponent from '../components/static/PostComponent.vue'
import LoaderImg from '../components/static/LoaderImg.vue'
import AppPagination from '../components/static/AppPagination.vue'
import UpBtn from '../components/static/UpBtn.vue'
import AddPostForm from '../components/static/AddPostForm.vue'
import MostLikedPostsCard from '../components/static/mostLikedPostsCard.vue'

import { useUserStore } from '~/stores/userStore.js'

import { usePostsStore } from '~/stores/postsStore'

const postsStore = usePostsStore()
const userStore = useUserStore()

const loading = ref(false)
const isPosting = ref(false)

const mostLikedPosts = computed(() => {
	return [...postsStore.posts]
		.filter(post => (post.likesCount ?? 0) > 0)
		.sort((firstPost, secondPost) => {
			return (secondPost.likesCount ?? 0) - (firstPost.likesCount ?? 0)
		})
		.slice(0, 3)
})

// pagination-block
const currentPage = ref(1)
const ITEMS_PER_PAGE = 5

const changePage = async (page: number) => {
	currentPage.value = page
}

const paginatedPosts = computed(() => {
	const start = (currentPage.value - 1) * ITEMS_PER_PAGE
	const end = start + ITEMS_PER_PAGE
	return postsStore.posts.slice(start, end)
})

const totalPages = computed(() =>
	Math.ceil(postsStore.posts.length / ITEMS_PER_PAGE),
)

onMounted(async () => {
	loading.value = true

	try {
		await postsStore.fetchPosts()
	} catch (err) {
		console.error(err)
	} finally {
		loading.value = false
	}
})

useSeoMeta({
	title: 'Блог',
	description: 'Лента публикаций и постов пользователей.',
	ogTitle: 'Блог',
	ogDescription: 'Лента публикаций и постов пользователей.',
	ogType: 'website',
	ogImage: '/images/preview-blog.jpg',
	twitterCard: 'summary_large_image',
	twitterTitle: 'Блог',
	twitterDescription: 'Лента публикаций и постов пользователей.',
	twitterImage: '/images/preview-blog.jpg',
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/global/variables';

.blog {
	&__heading {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.62rem;
		margin-bottom: 0.62rem;

		&--center {
			grid-template-columns: 1fr;
			justify-items: center;
		}

		@media (max-width: 56.25rem) {
			grid-template-columns: 1fr;
			grid-template-rows: repeat(2, 1fr);
		}
	}

	&__title {
		text-align: center;
		// margin-bottom: 1rem;
		color: var(--text);

		@media (max-width: 48rem) {
			font-size: $px-22;
		}
	}

	&__add-post {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		@media (max-width: 48rem) {
			gap: 0.5rem;
		}
	}

	&__add-post-btn {
		width: 100%;
	}

	&__pagination {
		margin-bottom: 1.12rem;

		@media (max-width: 48rem) {
			margin-bottom: 0.5rem;
		}
	}

	&__main-wrapper {
		display: grid;
		grid-template-columns: 1fr 0.5fr;
		gap: 1rem;

		// margin-bottom: 1.12rem;

		@media (max-width: 64rem) {
			grid-template-columns: 1fr;
		}
	}

	&__wrapper {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	&__content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		justify-content: center;
		width: 100%;
	}

	&__posts {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		@media (max-width: 48rem) {
			gap: 0.5rem;
		}
	}

	&__most-liked-wrapper {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		@media (max-width: 64rem) {
			display: none;
		}
	}

	.post-list-enter-active,
	.post-list-leave-active,
	.post-list-move {
		transition: all 0.35s ease;
	}

	.post-list-enter-from,
	.post-list-leave-to {
		opacity: 0;
		transform: translateY(16px);
	}

	.post-list-leave-active {
		position: absolute;
		width: 100%;
	}

	.form-wrapper-enter-active {
		transition:
			opacity 0.3s ease-out,
			transform 0.3s ease-out;
	}

	.form-wrapper-leave-active {
		transition:
			opacity 0.3s ease-in,
			transform 0.3s ease-in;
	}

	.form-wrapper-enter-from,
	.form-wrapper-leave-to {
		opacity: 0;
		transform: translateX(-2.5rem);
	}

	.form-wrapper-enter-to,
	.form-wrapper-leave-from {
		opacity: 1;
		transform: translateX(0);
	}
}
</style>
