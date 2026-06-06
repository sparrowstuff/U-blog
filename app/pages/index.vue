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

		<UpBtn />
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
import UpBtn from '../components/static/UpBtn.vue'

const postsStore = usePostsStore()

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
}
</style>
