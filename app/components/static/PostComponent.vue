<template>
	<article class="post-card">
		<div class="post-card__wrapper" v-if="post">
			<div class="post-card__heading">
				<div class="post-card__inner-heading">
					<img
						class="post-card__user-photo"
						:src="post.user?.avatarUrl || '/images/no-photo.webp'"
						alt="User photo"
						aria-label="Фото профиля"
						width="40"
						height="40"
					/>
					<div class="post-card__user-info">
						<h3 class="post-card__user-name">{{ post.user?.name }}</h3>
					</div>
				</div>
				<span class="post-card__created-at">{{ dateFormatted }}</span>
			</div>

			<div
				class="post-card__main"
				:class="{ 'post-card__main--clickable': !showCommentsImmediately }"
				@mouseenter="!showCommentsImmediately && (postHelper = true)"
				@mouseleave="postHelper = false"
				@click="goToPost"
			>
				<h4 class="post-card__post-title">{{ post.title }}</h4>
				<p class="post-card__post-description">
					{{ post.description }}
				</p>
			</div>

			<span
				v-if="!showCommentsImmediately"
				class="post-card__helper"
				:class="{ 'post-card__helper--show': postHelper }"
			>
				Нажмите на пост чтобы перейти на отдельную страницу данного поста
			</span>

			<div class="post-card__commentary-block">
				<Transition name="comment-form-slide-fade" mode="out-in">
					<CommentForm
						v-if="isCommenting"
						key="comment-form"
						:post-id="post.id"
						@cancel-texting="isCommenting = false"
					/>

					<div v-else key="comment-buttons" class="post-card__btn-block">
						<button
							v-if="userStore.isAuthenticated"
							class="post-card__add-comment-btn btn btn--transparent"
							type="button"
							aria-label="Написать комментарий"
							@click="openCommentForm"
						>
							Написать комментарий
						</button>

						<div class="post-card__comment-btn-wrapper">
							<button
								v-if="!showCommentsImmediately"
								class="post-card__show-comments-btn btn btn--comment"
								type="button"
								:aria-label="
									isShowingComments
										? 'Скрыть комментарии поста'
										: 'Показать комментарии поста'
								"
								@click="showComments"
							>
								<svg
									class="post-card__show-comments-icon"
									:class="{
										'post-card__show-comments-icon--active': isShowingComments,
									}"
									xmlns="http://www.w3.org/2000/svg"
									width="30"
									height="30"
									fill="transparent"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="1"
										d="M12 21a9 9 0 1 0-9-9c0 1.488.36 2.891 1 4.127L3 21l4.873-1c1.236.64 2.64 1 4.127 1"
									/>
								</svg>
							</button>
							<HandWrittenTooltip
								class="tooltip"
								:text="'Открыть комментарии'"
							/>
						</div>
					</div>
				</Transition>

				<Transition name="comments-slide-fade">
					<div
						v-if="showCommentsImmediately || isShowingComments"
						class="post-card__comments"
					>
						<CommentComponent
							v-for="comment in postComments"
							:key="comment.id"
							:comment="comment"
						/>

						<span
							v-if="postComments.length === 0"
							class="post-card__no-comments"
						>
							Пока что нет комментариев
						</span>
					</div>
				</Transition>

				<div class="post-card__bottom-menu">
					<button
						v-if="userStore.user?.id === post.user.id"
						class="post-card__delete-btn btn btn--transparent"
						type="button"
						aria-label="Удалить пост"
						@click="deleteCurrentPost"
					>
						Удалить пост?
					</button>

					<LikesMenu
						:post-id="post.id"
						:likes-count="post.likesCount ?? 0"
						:dislikes-count="post.dislikesCount ?? 0"
						:user-reaction="post.userReaction"
					/>
				</div>
			</div>
		</div>
	</article>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import CommentForm from './CommentForm.vue'
import CommentComponent from './CommentComponent.vue'
import LikesMenu from './LikesMenu.vue'
import HandWrittenTooltip from './HandWrittenTooltip.vue'
import { useCommentsStore } from '~/stores/commentsStore.js'
import { usePostsStore } from '~/stores/postsStore.js'
import { useUserStore } from '~/stores/userStore.js'
import type { ReactionType } from '~/types/Reaction.js'
import type { PublicPost } from '~/types/PublicPost.js'

const route = useRoute()

const commentsStore = useCommentsStore()
const postsStore = usePostsStore()
const userStore = useUserStore()

const props = defineProps<{
	post: PublicPost
	showCommentsImmediately: boolean
}>()

const postHelper = ref(false)
const isSinglePostPage = computed(
	() => route.path.startsWith('/post/') || route.path.startsWith('/user/'),
)
const isCommenting = ref(false)
const isShowingComments = ref(false)

const postComments = computed(() =>
	commentsStore.getCommentsByPostId(props.post.id),
)

const dateFormatted = computed(() => {
	const date = new Date(props.post.createdAt)

	const formatter = new Intl.DateTimeFormat('ru-ru', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	})

	const dateHours = String(date.getHours()).padStart(2, '0')
	const dateMinutes = String(date.getMinutes()).padStart(2, '0')

	return `${formatter.format(date)} | ${dateHours}:${dateMinutes}`
})

const openCommentForm = () => {
	isCommenting.value = true
}

const showComments = () => {
	isShowingComments.value = !isShowingComments.value
}

const deleteCurrentPost = async () => {
	if (!userStore.user?.id) return

	await postsStore.deletePost(props.post.id, userStore.user.id)
}

const goToPost = () => {
	if (isSinglePostPage.value) return

	navigateTo(`/post/${props.post.id}`)
}

onMounted(async () => {
	await commentsStore.fetchCommentsByPostId(props.post.id)
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/global/variables';

.post-card {
	padding: 0.62rem 0.62rem 0.62rem 0.62rem;
	border: 1px solid var(--border);
	border-radius: 0.5rem;
	min-height: 10rem;
	background: rgba(255, 255, 255, 0.08);
	backdrop-filter: blur(20px) saturate(180%);
	-webkit-backdrop-filter: blur(20px) saturate(180%);

	transition: box-shadow $transition-300;

	&:hover {
		box-shadow: 0 0.5rem 1rem var(--shadow);
	}

	&__wrapper {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
	}

	&__heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;

		@media (max-width: 25rem) {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}
	}

	&__heading {
		display: flex;
		align-items: center;
		gap: 0.62rem;

		@media (max-width: 25rem) {
			align-items: flex-start;
		}
	}

	&__inner-heading {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	&__user-info {
		display: flex;
		align-items: center;
		gap: 0.3rem;

		@media (max-width: 25rem) {
			flex-direction: column;
			align-items: flex-start;
		}
	}

	&__user-photo {
		border-radius: 50%;
		object-fit: cover;
		object-position: center;
		display: block;
	}

	&__user-name,
	&__user-email {
		font-weight: 600;
		line-height: 110%;
		color: var(--text);
	}

	&__divide {
		@media (max-width: 25rem) {
			display: none;
		}
	}

	&__user-name {
		font-size: $px-24;

		@media (max-width: 48rem) {
			font-size: $px-20;
		}
	}

	&__user-email {
		font-size: $px-20;

		@media (max-width: 48rem) {
			font-size: $px-14;
		}
	}

	&__main {
		padding: 0.2rem 0.2rem 0.2rem 0.2rem;
		position: relative;

		display: flex;
		flex-direction: column;
		gap: 1rem;

		&::before {
			content: '';
			width: 100%;
			height: 1px;
			background-color: var(--border);
			position: absolute;
			top: -5%;
			left: 0;
			filter: blur(1px);
		}

		&::after {
			content: '';
			width: 100%;
			height: 1px;
			background-color: var(--border);
			position: absolute;
			bottom: -5%;
			left: 0;
			filter: blur(1px);
		}
	}

	&__main--clickable {
		cursor: pointer;
	}

	&__post-title,
	&__post-description {
		color: $white;

		line-height: 110%;
		color: var(--text);
	}

	&__post-title {
		font-size: $px-20;
		font-weight: 200;

		@media (max-width: 48rem) {
			font-size: $px-16;
		}
	}

	&__post-description {
		font-size: $px-24;
		font-style: oblique;
		font-weight: 400;

		@media (max-width: 48rem) {
			font-size: $px-20;
		}
	}

	&__commentary-block {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	&__helper {
		opacity: 0;
		display: block;
		transform: translateY(0.25rem);
		pointer-events: none;

		transition:
			opacity $transition-300,
			clip-path $transition-300,
			transform $transition-300;

		@media (max-width: 48rem) {
			font-size: $px-14;
		}
	}

	&__helper--show {
		opacity: 1;
	}

	&__add-comment-btn {
		width: fit-content;

		@media (max-width: 48rem) {
			padding: 0.1rem 0.2rem;
			font-size: $px-14;
		}
	}

	&__comment-btn-wrapper {
		position: relative;

		&:hover,
		&:focus-visible {
			> .tooltip {
				opacity: 1;
				transform: translateY(0);
			}
		}
	}

	&__show-comments-icon {
		transition: fill $transition-300;
	}

	&__show-comments-btn {
		&:hover,
		&:focus-visible {
			& svg {
				fill: var(--accent);
			}
		}
	}

	&__comments {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		background-color: var(--surface-alt);
		padding: 0.4rem 0.4rem 0.4rem 0.4rem;
		border-radius: 0.4rem;
	}

	&__btn-block {
		display: flex;
		align-items: center;
		gap: 0.62rem;
	}

	&__bottom-menu {
		display: flex;
		flex-direction: row-reverse;
		align-items: center;
		gap: 0.4rem;

		@media (max-width: 48rem) {
			justify-content: space-between;
			gap: 0.1rem;
		}
	}

	&__delete-btn {
		width: fit-content;

		@media (max-width: 48rem) {
			padding: 0.1rem 0.2rem;
			font-size: $px-14;
		}
	}

	.comments-slide-fade-enter-active {
		transition: all 0.8s cubic-bezier(1, 1, 0.8, 1);
	}

	.comments-slide-fade-leave-active {
		transition: all 0.3s ease-out;
	}

	.comments-slide-fade-enter-from,
	.comments-slide-fade-leave-to {
		transform: translateY(-1rem);
		opacity: 0;
	}

	.comment-form-slide-fade-enter-active,
	.comment-form-slide-fade-leave-active {
		transition:
			opacity 0.3s ease,
			transform 0.3s ease;
	}

	.comment-form-slide-fade-enter-from,
	.comment-form-slide-fade-leave-to {
		opacity: 0;
		transform: translateY(1rem);
	}
}

.tooltip {
	position: absolute;
	bottom: -1.6rem;
	left: -50%;
}
</style>
