<template>
	<article class="most-liked-post" @click="goToThisPost">
		<div class="most-liked-post__heading">
			<img
				class="most-liked-post__user-avatar"
				:src="props.post.user.avatarUrl || '/images/no-photo.webp'"
				:alt="props.post.user.name"
				width="30"
				height="30"
			/>
			<h3 class="most-liked-post__email">{{ props.post.user.email }}</h3>
		</div>
		<div class="most-liked-post__main">
			<p class="most-liked-post__title">{{ props.post.title }}</p>
			<div class="most-liked-post__likes-wrapper">
				<span class="most-liked-post__text">{{ props.post.text }}</span>
				<span class="most-liked-post__likes">
					<svg
						class="most-liked-post__like-icon"
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
					{{ props.post.likesCount ?? 0 }}
				</span>
			</div>
		</div>
	</article>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

import type { PublicPost } from '@/types/Post'

const goToThisPost = () => {
	navigateTo('/post/' + props.post.id)
}

const props = defineProps<{
	post: PublicPost
}>()
</script>

<style scoped lang="scss">
@import '@/assets/styles/global/variables';

.most-liked-post {
	padding: 0.5rem;
	border: 1px solid var(--border);
	border-radius: 0.5rem;
	min-height: 5rem;

	display: flex;
	flex-direction: column;
	gap: 0.5rem;

	cursor: pointer;

	transition: border-color $transition-300, scale $transition-300;

	&:hover,
	&:focus-visible {
		border-color: $apple;
		scale: 1.02;
	}

	&__heading {
		display: flex;
		align-items: center;
		gap: 0.2rem;
	}

	&__user-avatar {
		border-radius: 50%;
		object-fit: cover;
	}

	&__main {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.2rem;
		margin-top: auto;
	}

	&__likes {
		display: flex;
		align-items: center;
		gap: 0.3rem;
	}

	&__likes-wrapper {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.2rem;
	}

	&__like-icon {
		transform: rotate(180deg);
	}
}
</style>
