<template>
	<article class="post-card">
		<div class="post-card__wrapper" v-if="post">
			<div class="post-card__heading">
				<div class="post-card__inner-heading">
					<h3 class="post-card__user-name">{{ post.user.name }}</h3>
					<span class="post-card__divide">|</span>
					<p class="post-card__user-email">{{ post.user.email }}</p>
				</div>
				<span class="post-card__created-at">{{ post.createdAt }}</span>
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
				<div
					v-if="!showCommentsImmediately && !isCommenting"
					class="post-card__btn-block"
				>
					<button
						class="post-card__add-comment-btn btn btn--transparent"
						type="button"
						@click="openCommentForm"
					>
						Добавить комментарий
					</button>

					<button
						class="post-card__show-comments-btn btn btn--transparent"
						type="button"
						aria-label="Смотреть комментарии поста"
						@click="showComments"
					>
						{{
							isShowingComments
								? 'Скрыть комментарии'
								: 'Посмотреть комментарии'
						}}
					</button>
				</div>

				<CommentForm
					v-else-if="!showCommentsImmediately"
					:post-id="post.id"
					@cancel-texting="isCommenting = false"
				/>

				<div
					v-if="showCommentsImmediately || isShowingComments"
					class="post-card__comments"
				>
					<CommentComponent
						v-for="comment in postComments"
						:key="comment.id"
						:comment="comment"
					/>

					<span v-if="postComments.length === 0" class="post-card__no-comments">
						Пока что нет комментариев
					</span>
				</div>

				<div class="post-card__bottom-menu">
					<button
						v-if="userStore.user?.id === post?.user?.id"
						class="post-card__delete-btn btn"
						aria-label="Удалить пост"
						type="button"
						@click="deleteCurrentPost"
					>
						Удалить пост?
					</button>
					<LikesMenu
						:post-id="post.id"
						:likes-count="post.likesCount"
						:dislikes-count="post.dislikesCount"
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
import { useCommentsStore } from '~/stores/commentsStore.js'
import { usePostsStore } from '~/stores/postsStore.js'
import { useUserStore } from '~/stores/userStore.js'

const route = useRoute()

const commentsStore = useCommentsStore()
const postsStore = usePostsStore()
const userStore = useUserStore()

type ReactionType = 'like' | 'dislike' | null

type PostCard = {
	id: number
	title: string
	description: string
	createdAt: string
	likesCount?: number
	dislikesCount?: number
	userReaction?: ReactionType
	user: {
		id: number
		name: string
		surName: string
		email: string
	}
}

const props = defineProps<{
	post: PostCard
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
	border: 1px solid $white;
	border-radius: 0.5rem;
	min-height: 10rem;

	&__wrapper {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.8rem;

		@media (max-width: 31.25rem) {
			gap: 1rem;
		}
	}

	&__heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;

		@media (max-width: 31.25rem) {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}
	}

	&__inner-heading {
		display: flex;
		align-items: baseline;
		gap: 0.3rem;
	}

	&__user-name,
	&__user-email {
		font-weight: 600;
		line-height: 110%;
	}

	&__user-name {
		font-size: $px-24;
	}

	&__user-email {
		font-size: $px-20;
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
			background-color: $black;
			position: absolute;
			top: -5%;
			left: 0;
			filter: blur(1px);
		}

		&::after {
			content: '';
			width: 100%;
			height: 1px;
			background-color: $black;
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
		font-weight: 400;
		line-height: 110%;
	}

	&__post-title {
		font-size: $px-24;
	}

	&__commentary-block {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	&__helper {
		opacity: 0;
		// clip-path: polygon(100% 0%, 100% 0%, 0% 0%, 0% 0%);
		display: block;
		transform: translateY(0.25rem);
		pointer-events: none;

		transition:
			opacity $transition-300,
			clip-path $transition-300,
			transform $transition-300;
	}

	&__helper--show {
		opacity: 1;
		// clip-path: polygon(100% 0%, 100% 100%, 0% 100%, 0% 0%);
	}

	&__add-comment-btn {
		width: fit-content;
	}

	&__comments {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		background-color: $black;
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
		align-items: center;
		gap: 0.4rem;
	}

	&__delete-btn {
		width: fit-content;
	}
}
</style>
