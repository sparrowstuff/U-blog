<template>
	<article class="comment">
		<div class="comment__wrapper">
			<div class="comment__main">
				<div class="comment__heading">
					<div class="comment__author-block">
						<img
							v-if="comment.user.avatarUrl"
							:src="comment.user.avatarUrl"
							:alt="`${comment.user.name} avatar`"
							class="comment__author-img"
							width="40"
							height="40"
						/>
						<h4 class="comment__author-name">
							{{ comment.user.name }} {{ comment.user.surName }}
						</h4>
					</div>
					<p class="comment__created-at">{{ dateFormatted }}</p>
				</div>
				<p class="comment__comment">{{ comment.content }}</p>
			</div>
			<button
				v-if="canDelete"
				class="comment__delete-comment-btn btn btn--transparent"
				type="button"
				@click="deleteThisComment"
				:disabled="isDeleting"
			>
				{{ isDeleting ? 'Удаление...' : 'Удалить комментарий' }}
			</button>
		</div>
	</article>
</template>

<script setup lang="ts">
import { useCommentsStore } from '~/stores/commentsStore'
import { useUserStore } from '~/stores/userStore'
import { ref, computed } from 'vue'

const commentsStore = useCommentsStore()
const userStore = useUserStore()

const props = defineProps<{
	comment: {
		id: number
		content: string
		createdAt: string
		updatedAt: string
		userId: number
		postId: number
		user: {
			id: number
			name: string
			surName: string
			email: string
			avatarUrl: string | null
		}
	}
}>()

const isDeleting = ref(false)

const canDelete = computed(() => userStore.user?.id === props.comment.userId)

const dateFormatted = computed(() => {
	const date = new Date(props.comment.createdAt)

	const formatter = new Intl.DateTimeFormat('ru-ru', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	})

	const dateHours = String(date.getHours()).padStart(2, '0')
	const dateMinutes = String(date.getMinutes()).padStart(2, '0')

	return `${formatter.format(date)} | ${dateHours}:${dateMinutes}`
})

const deleteThisComment = async () => {
	if (!canDelete.value || isDeleting.value) return

	isDeleting.value = true

	try {
		await commentsStore.deleteComment(props.comment.postId, props.comment.id)
	} catch (err) {
		console.warn('Нельзя удалить чужой комментарий')
		alert('Вы можете удалять только комментарии написанные вами')
		throw err
	} finally {
		isDeleting.value = false
	}
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/global/variables';

.comment {
	color: $apple;

	&:nth-child(n) {
		border-bottom: 1px solid $white;
		padding-bottom: 0.5rem;
	}

	&__wrapper {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.62rem;

		@media (max-width: 48rem) {
			flex-direction: column;
			align-items: flex-start;
		}
	}

	&__main {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
	}

	&__heading {
		display: flex;
		align-items: center;
		gap: 0.62rem;

		@media (max-width: 48rem) {
			justify-content: space-between;
		}

		@media (max-width: 31.25rem) {
			flex-direction: column;
			align-items: flex-start;
		}
	}

	&__author-block {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	&__author-name {
		font-size: $px-22;
		font-weight: 600;

		@media (max-width: 48rem) {
			font-size: $px-18;
		}
	}

	&__comment {
		font-size: $px-18;

		@media (max-width: 48rem) {
			font-size: $px-14;
		}
	}
}
</style>
