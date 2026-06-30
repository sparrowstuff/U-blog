<template>
	<section class="blog">
		<h1 class="blog__title">It's a great time for a post</h1>

		<div class="container">
			<div class="blog__wrapper">
				<div class="blog__add-post" v-if="userStore.isAuthenticated">
					<button
						class="blog__add-post-btn btn btn--transparent"
						type="button"
						aria-label="Написать пост"
						@click="isPosting = !isPosting"
					>
						Написать пост
					</button>
					<AddPostForm v-if="isPosting" />
				</div>
				<AppPagination
					:total-pages="totalPages"
					:current-page="currentPage"
					@update:current-page="changePage"
				/>
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

import { useUserStore } from '~/stores/userStore.js'

import { usePostsStore } from '~/stores/postsStore'

const postsStore = usePostsStore()
const userStore = useUserStore()

const loading = ref(false)
const isPosting = ref(false)

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
</script>

<style scoped lang="scss">
@import '@/assets/styles/global/variables';

.blog {
	&__title {
		text-align: center;
		margin-bottom: 1rem;
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
}
</style>
