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
						/>
						<h4 class="comment__author-name">
							{{ comment.user.name }} {{ comment.user.surName }}
						</h4>
					</div>
					<p class="comment__created-at">{{ comment.createdAt }}</p>
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
	}

	&__main {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
	}

	&__heading {
		display: flex;
		align-items: baseline;
		gap: 0.62rem;
	}

	&__author-name {
		font-size: $px-22;
		font-weight: 600;
	}

	&__comment {
		font-size: $px-18;
	}
}
</style>
