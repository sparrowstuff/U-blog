<template>
	<section class="hero">
		<div class="container">
			<div class="hero__wrapper">
				<h1 class="hero__title">Hello bloggers</h1>
				<AppPagination
					:total-pages="totalPages"
					:current-page="currentPage"
					@update:current-page="changePage"
				/>

				<div class="hero__content" v-if="!loading">
					<PostComponent
						v-for="post in paginatedPosts"
						:key="post.id"
						:post="post"
						:show-comments-immediately="false"
					/>
					<AddPostForm />
				</div>
				<LoaderImg v-else />
			</div>
		</div>
		<ClientOnly>
			<button
				v-show="isDownScroll"
				class="hero__up-btn btn btn--up"
				aria-label="Подняться наверх"
				type="button"
				@click="scrollToTop"
			>
				<svg
					version="1.1"
					id="Capa_1"
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					x="0px"
					y="0px"
					width="20"
					height="20"
					viewBox="0 0 284.929 284.929"
					style="enable-background: new 0 0 284.929 284.929"
					xml:space="preserve"
				>
					<g>
						<path
							d="M282.082,195.285L149.028,62.24c-1.901-1.903-4.088-2.856-6.562-2.856s-4.665,0.953-6.567,2.856L2.856,195.285
			C0.95,197.191,0,199.378,0,201.853c0,2.474,0.953,4.664,2.856,6.566l14.272,14.271c1.903,1.903,4.093,2.854,6.567,2.854
			c2.474,0,4.664-0.951,6.567-2.854l112.204-112.202l112.208,112.209c1.902,1.903,4.093,2.848,6.563,2.848
			c2.478,0,4.668-0.951,6.57-2.848l14.274-14.277c1.902-1.902,2.847-4.093,2.847-6.566
			C284.929,199.378,283.984,197.188,282.082,195.285z"
						/>
					</g>
					<g></g>
					<g></g>
					<g></g>
					<g></g>
					<g></g>
					<g></g>
					<g></g>
					<g></g>
					<g></g>
					<g></g>
					<g></g>
					<g></g>
					<g></g>
					<g></g>
					<g></g>
				</svg>
			</button>
		</ClientOnly>
	</section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { usePostsStore } from '~/stores/postsStore'
import { useCommentsStore } from '~/stores/commentsStore.js'
import PostComponent from '../components/static/PostComponent.vue'
import LoaderImg from '../components/static/LoaderImg.vue'
import AddPostForm from '../components/static/AddPostForm.vue'
import AppPagination from '../components/static/AppPagination.vue'

const postsStore = usePostsStore()
const commentsStore = useCommentsStore()

const loading = ref(false)
const isDownScroll = ref(false)

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

// scroll on top block
const checkScroll = () => {
	isDownScroll.value = window.scrollY > 300
}

const scrollToTop = () => {
	window.scrollTo({
		top: 0,
		behavior: 'smooth',
	})
}

onMounted(async () => {
	loading.value = true

	try {
		await postsStore.fetchPosts()
	} catch (err) {
		console.error(err)
	} finally {
		loading.value = false
	}

	addEventListener('scroll', checkScroll)
})

onUnmounted(() => {
	removeEventListener('scroll', checkScroll)
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/global/variables.scss';

.hero {
	margin-bottom: 1.12rem;

	&__title {
		text-align: center;
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

	&__up-btn {
		position: fixed;
		bottom: 3%;
		right: 2%;
	}
}
</style>
