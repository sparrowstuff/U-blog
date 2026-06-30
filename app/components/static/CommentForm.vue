<template>
	<form @submit.prevent="handleSubmit" class="comment-form">
		<div class="comment-form__wrapper">
			<div class="comment-form__input-wrapper">
				<div class="comment-input">
					<textarea
						class="comment-input__textarea"
						name="commentInput"
						id="commentInput"
						rows="4"
						cols="10"
						placeholder="Напишите комментарий..."
						required
						minlength="3"
						maxlength="300"
						autocomplete="comment-text"
						spellcheck="true"
						v-model="commentText"
					></textarea>
				</div>
			</div>
			<div class="comment-form__btn-wrapper">
				<button
					class="comment-form__clear-btn btn btn--transparent"
					type="button"
					@click="clearComment"
				>
					Очистить
				</button>
				<button
					class="comment-form__cancel-btn btn btn--transparent"
					type="button"
					@click="cancelTexting"
				>
					Отменить
				</button>
				<button
					class="comment-form__submit-btn btn"
					type="submit"
					:disabled="isLoading"
				>
					{{ isLoading ? 'Отправка..' : 'Добавить' }}
				</button>
			</div>
		</div>
	</form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCommentsStore } from '~/stores/commentsStore'
import { useUserStore } from '~/stores/userStore'

const commentsStore = useCommentsStore()
const userStore = useUserStore()

const commentText = ref('')
const isLoading = ref(false)

const props = defineProps<{
	postId: number
}>()

const emit = defineEmits(['cancelTexting'])

const handleSubmit = async () => {
	if (!userStore.user?.id) return
	if (!commentText.value.trim()) return

	isLoading.value = true

	try {
		await commentsStore.addComment(props.postId, {
			content: commentText.value.trim(),
			userId: userStore.user.id,
		})

		commentText.value = ''
	} catch (err) {
		console.error(err)
	} finally {
		isLoading.value = false
	}
}

const clearComment = () => {
	commentText.value = ''
}

const cancelTexting = () => {
	emit('cancelTexting')
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/global/variables';

.comment-form {
	&__wrapper {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.62rem;

		@media (max-width: 48rem) {
			flex-direction: column;
		}
	}

	&__input-wrapper {
		width: 100%;
	}

	&__btn-wrapper {
		display: flex;
		align-items: center;
		gap: 0.62rem;

		@media (max-width: 48rem) {
			flex-direction: column;
			align-items: unset;
			width: 100%;
		}
	}

	&__clear-btn,
	&__cancel-btn,
	&__submit-btn {
		@media (max-width: 48rem) {
			padding: 0.1rem 0.2rem;
			font-size: $px-12;
			width: 100%;
		}
	}
}

.comment-input {
	width: 100%;
	position: relative;
	$root: &;

	&__textarea {
		width: 100%;
		// border: 1px solid $blue-grey;
		border: 1px solid var(--border);
		border-radius: 0.3rem;
		padding: 0.5rem 0.5rem 0.5rem 0.5rem;
		// color: $white;
		color: var(--text);
		background-color: transparent;
		field-sizing: content;

		transition: border-color $transition-300;

		&::placeholder {
			font-size: $px-14;
			line-height: 110%;
			// color: $white;
			color: var(--text-muted);
		}
	}
}
</style>
