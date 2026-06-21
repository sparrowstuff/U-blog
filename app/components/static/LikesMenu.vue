<template>
	<article class="likes-menu">
		<div class="likes-menu__wrapper">
			<button
				class="likes-menu__like btn btn--like"
				:class="{ 'likes-menu__like--active': isLiked }"
				type="button"
				aria-label="Поставить посту лайк"
				:disabled="isLoading"
				@click="addLike"
			>
				<svg
					class="likes-menu__like-icon"
					xmlns="http://www.w3.org/2000/svg"
					width="25"
					height="25"
					fill="none"
					viewBox="-0.5 0 25 25"
				>
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
						d="M8.67 5.5v5.53M8.67 11.03l2.75 9.16a1.45 1.45 0 0 0 1.39 1.06v0a1.46 1.46 0 0 0 1.45-1.47V14.5"
					/>
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
						d="M2.001 12.25a3.34 3.34 0 1 0 6.67 0V6.62a3.34 3.34 0 1 0-6.67 0z"
					/>
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
						d="M8.67 6.62A3.35 3.35 0 0 1 12 3.25h4.12a4.44 4.44 0 0 1 4.26 3.2l1.5 5.08a2.25 2.25 0 0 1-2.1 3h-5.5"
					/>
				</svg>
			</button>
			<span class="likes-menu__count">{{ props.likesCount }}</span>
		</div>
		<div class="likes-menu__wrapper">
			<button
				class="likes-menu__dislike btn btn--like"
				:class="{ 'likes-menu__dislike--active': isDisliked }"
				type="button"
				aria-label="Поставить посту дизлайк"
				:disabled="isLoading"
				@click="addDislike"
			>
				<svg
					class="likes-menu__dislike-icon"
					xmlns="http://www.w3.org/2000/svg"
					width="25"
					height="25"
					fill="none"
					viewBox="-0.5 0 25 25"
				>
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
						d="M8.67 5.5v5.53M8.67 11.03l2.75 9.16a1.45 1.45 0 0 0 1.39 1.06v0a1.46 1.46 0 0 0 1.45-1.47V14.5"
					/>
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
						d="M2.001 12.25a3.34 3.34 0 1 0 6.67 0V6.62a3.34 3.34 0 1 0-6.67 0z"
					/>
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
						d="M8.67 6.62A3.35 3.35 0 0 1 12 3.25h4.12a4.44 4.44 0 0 1 4.26 3.2l1.5 5.08a2.25 2.25 0 0 1-2.1 3h-5.5"
					/>
				</svg>
			</button>
			<span class="likes-menu__count">{{ props.dislikesCount }}</span>
		</div>
	</article>
</template>

<script setup lang="ts">
import { usePostsStore } from '~/stores/postsStore'
import { ref, computed } from 'vue'
import type { ReactionType } from '@/types/Reaction'

const props = defineProps<{
	postId: number
	likesCount: number
	dislikesCount: number
	userReaction: ReactionType
}>()

const postsStore = usePostsStore()

const isLiked = computed(() => props.userReaction === 'like')
const isDisliked = computed(() => props.userReaction === 'dislike')
const isLoading = computed(() => postsStore.isLoading)

const addLike = async () => {
	// await postsStore.toggleReaction(props.postId, 'like')

	const res = await postsStore.toggleReaction(props.postId, 'like')

	postsStore.updatePostReaction(
		props.postId,
		res.likesCount,
		res.dislikesCount,
		res.userReaction,
	)

	if (res.userReaction !== 'like') {
		postsStore.removeLikedPost(props.postId)
	}
}

const addDislike = async () => {
	// await postsStore.toggleReaction(props.postId, 'dislike')

	const res = await postsStore.toggleReaction(props.postId, 'dislike')

	postsStore.updatePostReaction(
		props.postId,
		res.likesCount,
		res.dislikesCount,
		res.userReaction,
	)

	postsStore.removeLikedPost(props.postId)
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/global/variables';

.likes-menu {
	display: flex;
	align-items: center;
	gap: 0.62rem;
	margin-right: auto;

	$root: &;

	&__wrapper {
		display: flex;
		align-items: baseline;
		gap: 0.2rem;
	}

	&__like {
		&:hover,
		&:focus-visible {
			#{$root}__like-icon path {
				stroke: $purple-deep;
			}
		}
	}

	&__like--active {
		#{$root}__like-icon path {
			fill: currentColor;
			stroke: currentColor;
		}
	}

	&__dislike {
		&:hover,
		&:focus-visible {
			#{$root}__dislike-icon path {
				stroke: $red;
			}
		}
	}

	&__dislike--active {
		#{$root}__dislike-icon path {
			fill: $red;
			stroke: $red;
		}
	}

	&__like-icon {
		transform: rotate(180deg);
		display: block;
		transition: fill $transition-300;
	}

	&__dislike-icon {
		transition: fill $transition-300;
	}

	&__like-icon path {
		fill: transparent;
		transition:
			fill $transition-300,
			stroke $transition-300;
	}

	&__dislike-icon path {
		fill: transparent;
		transition:
			fill $transition-300,
			stroke $transition-300;
	}
}
</style>
