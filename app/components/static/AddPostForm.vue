<template>
	<form method="POST" class="add-post-form" @submit.prevent="submitForm">
		<div class="add-post-form__wrapper">
			<ClientOnly>
				<h3 class="add-post-form__title">{{ showRandomTitle }}</h3>
			</ClientOnly>
			<div class="custom-input">
				<label for="addPostTitle" class="custom-input__label"></label>
				<input
					type="text"
					name="addPostTitle"
					id="addPostTitle"
					class="custom-input__input"
					required
					autocomplete="post-title"
					v-model="postTitle"
					placeholder="Заголовок поста"
				/>
				<span class="add-post-form__error-text">{{ fieldErrors.title }}</span>
			</div>
			<div class="custom-textarea">
				<label for="addPostDescription" class="custom-input__label"></label>
				<textarea
					class="custom-textarea__textarea"
					name="addPostDescription"
					id="addPostDescription"
					required
					minlength="5"
					maxlength="300"
					autocomplete="post-description"
					rows="5"
					cols="33"
					spellcheck="true"
					v-model="postDescription"
					placeholder="Текст поста"
				></textarea>
				<span class="add-post-form__error-text" v-if="postsStore.customError">{{
					fieldErrors.description
				}}</span>
			</div>
		</div>
		<span class="add-post-form__global-error">{{
			postsStore.customError
		}}</span>
		<button
			class="add-post-form__clear-btn btn btn--transparent"
			type="button"
			aria-label="Очистить написание поста"
			@click="clearForm"
		>
			Очистить
		</button>
		<button
			class="add-post-form__submit-btn btn"
			type="submit"
			aria-label="Добавить пост"
			:disabled="postsStore.isLoading"
		>
			{{ postsStore.isLoading ? 'Сохранение...' : 'Создать пост' }}
		</button>
	</form>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { usePostsStore } from '@/stores/postsStore'
import { useUserStore } from '@/stores/userStore'

const titleMessages = [
	'Ваш пост...',
	'Напишите что думаете...',
	'Ваши мысли...',
	'Хммм...',
	'Мысли?',
]

const showRandomTitle = useState('add-post-form__title', () => {
	const randomIndex = Number(Math.floor(Math.random() * titleMessages.length))

	return titleMessages[randomIndex]
})

const postsStore = usePostsStore()
const userStore = useUserStore()

const postTitle = ref('')
const postDescription = ref('')

const fieldErrors = ref({
	title: '',
	description: '',
})

const clearForm = () => {
	postTitle.value = ''
	postDescription.value = ''
}

const clearErrors = () => {
	fieldErrors.value = {
		title: '',
		description: '',
	}
}

const validateForm = () => {
	clearErrors()

	let valid = true

	if (!postTitle.value.trim()) {
		fieldErrors.value.title = 'Введите название поста'
		valid = false
	}

	if (!postDescription.value.trim()) {
		fieldErrors.value.description = 'Введите текст поста'
		valid = false
	}

	return valid
}

const submitForm = async () => {
	if (!validateForm() || !userStore.user) return

	try {
		await postsStore.addPost({
			title: postTitle.value,
			description: postDescription.value,
			userId: userStore.user.id,
		})
		;((postTitle.value = ''), (postDescription.value = ''))
		clearErrors()
	} catch (err) {
		console.error('Что-то пошло не так', err)
	}
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/global/variables.scss';

.add-post-form {
	width: 100%;
	$root: &;
	padding: 0.62rem 0.62rem 0.62rem 0.62rem;
	border: 1px solid $primary;
	border-radius: 0.5rem;
	background-color: $black;

	display: flex;
	flex-direction: column;
	gap: 1rem;
	align-items: center;
	margin-top: 1.12rem;
	margin-bottom: 1.12rem;

	@media (max-width: 48rem) {
		gap: 0.3rem;
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
	}

	&__wrapper {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		align-items: center;
	}

	&__title {
		font-size: $px-24;
		line-height: 100%;
	}

	&__submit-btn {
		padding: 0.5rem 0.5rem 0.5rem 0.5rem;

		@media (max-width: 48rem) {
			padding: 0.1rem 0.5rem;
			font-size: $px-14;
		}
	}
}

.custom-input {
	width: 100%;
	position: relative;
	$root: &;

	&:hover,
	&:focus-within {
		#{$root}__logo {
			opacity: 1;
		}
	}

	&__label {
		position: absolute;
		top: 0.3rem;
		left: 1%;
	}

	&__logo {
		opacity: 0.5;

		transition: opacity $transition-300;
	}

	&__input {
		width: 100%;
		border: 1px solid $blue-grey;
		border-radius: 0.3rem;
		padding: 0.5rem 0.5rem 0.5rem 0.5rem;
		color: $white;
		background-color: transparent;

		transition: border-color $transition-300;

		&::placeholder {
			font-size: $px-14;
			line-height: 110%;
			color: $white;
		}
	}
}

.custom-textarea {
	width: 100%;
	$root: &;

	&__textarea {
		width: 100%;
		border: 1px solid $blue-grey;
		border-radius: 0.3rem;
		padding: 0.5rem 0.5rem 0.5rem 0.5rem;
		color: $white;
		font-size: $px-16;
		line-height: 110%;
		background-color: transparent;
		field-sizing: content;

		&::placeholder {
			font-size: $px-14;
			line-height: 110%;
			color: $white;
		}
	}
}
</style>
