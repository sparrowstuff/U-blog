<template>
	<section class="liked">
		<div class="container">
			<div class="liked__wrapper">
				<div class="liked__info">
					<h2 class="liked__greeting">
						Собрали здесь все что тебе когда либо понравилось,
					</h2>
					<span class="liked__user-name">{{ userStore.user?.name }}</span>
				</div>
				<div class="liked__loaded" v-if="userStore.user && !isLoading">
					<div class="liked__content" v-if="postsStore.likedPosts.length > 0">
						<AppPagination
							:total-pages="totalPages"
							:current-page="currentPage"
							@update:current-page="changePage"
						/>
						<TransitionGroup
							class="liked__posts"
							name="post-list"
							tag="article"
						>
							<PostComponent
								v-for="post in paginatedPosts"
								:key="post.id"
								:post="post"
								:show-comments-immediately="false"
							/>
						</TransitionGroup>
					</div>
					<span class="liked__no-content-text" v-else
						>Однако, пока что, вам ничего не понравилось...</span
					>
				</div>
				<LoaderImg v-else />
			</div>
		</div>
	</section>

	<UpBtn />
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

import { useUserStore } from '~/stores/userStore'
import { usePostsStore } from '~/stores/postsStore'
import PostComponent from '~/app/components/static/PostComponent.vue'
import LoaderImg from '~/app/components/static/LoaderImg.vue'
import UpBtn from '~/app/components/static/UpBtn.vue'
import AppPagination from '~/app/components/static/AppPagination.vue'

const userStore = useUserStore()
const postsStore = usePostsStore()

const isLoading = ref(false)

// pagination-block
const currentPage = ref(1)
const ITEMS_PER_PAGE = 3

const changePage = async (page: number) => {
	currentPage.value = page
}

const paginatedPosts = computed(() => {
	const start = (currentPage.value - 1) * ITEMS_PER_PAGE
	const end = start + ITEMS_PER_PAGE
	return postsStore.likedPosts.slice(start, end)
})

const totalPages = computed(() =>
	Math.ceil(postsStore.likedPosts.length / ITEMS_PER_PAGE),
)

definePageMeta({
	middleware: 'auth',
})

watch(
	() => userStore.user,
	user => {
		if (!user) {
			navigateTo('/')
		}
	},
)

onMounted(async () => {
	isLoading.value = true

	try {
		if (userStore.user?.id) {
			await postsStore.fetchLikedByUserPosts(userStore.user.id)
		}
	} catch (err) {
		console.error(err)
	} finally {
		isLoading.value = false
	}
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/global/variables';

.liked {
	&__wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.62rem;
	}

	&__info {
		display: flex;
		align-items: baseline;
		gap: 0.2rem;
		flex-wrap: wrap;

		@media (max-width: 48rem) {
			flex-direction: column;
			align-items: center;
		}
	}

	&__greeting {
		font-weight: 400;

		@media (max-width: 48rem) {
			font-size: $px-22;
			text-align: center;
		}
	}

	&__user-name {
		font-size: $px-24;
		font-weight: 600;
		color: $apple;

		@media (max-width: 48rem) {
			text-align: center;
		}
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

	&__no-content-text {
		font-size: $px-22;
		line-height: 110%;
		font-weight: 400;
		color: $apple;
		text-align: right;
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
