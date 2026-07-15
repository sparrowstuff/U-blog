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
					maxlength="100"
					autocomplete="post-title"
					v-model="postTitle"
					placeholder="Заголовок поста - до 100 символов"
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
					maxlength="2000"
					autocomplete="post-description"
					rows="5"
					cols="33"
					spellcheck="true"
					v-model="postDescription"
					placeholder="Текст поста - От 5 до 2000 символов"
				></textarea>
				<span class="add-post-form__error-text" v-if="postsStore.customError">{{
					fieldErrors.description
				}}</span>
			</div>
		</div>
		<!-- <span class="add-post-form__global-error">{{
			postsStore.customError
		}}</span> -->
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

		<span class="add-post-form__user-error" v-if="fieldErrors.user">{{
			fieldErrors.user
		}}</span>

		<span class="add-post-form__go-to-text" v-if="isPostSubmitted"
			>Супер! Пост отправлен! Посмотреть в
			<b>
				<NuxtLink
					class="add-post-form__blog-link"
					aria-label="Переход на страницу блога"
					:to="'/blog'"
					>Блоге</NuxtLink
				></b
			>?</span
		>
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

// const isRendered = ref(false)

const showRandomTitle = useState('add-post-form__title', () => {
	const randomIndex = Number(Math.floor(Math.random() * titleMessages.length))

	return titleMessages[randomIndex]
})

const postsStore = usePostsStore()
const userStore = useUserStore()

const postTitle = ref('')
const postDescription = ref('')
const isPostSubmitted = ref(false)

const fieldErrors = ref({
	title: '',
	description: '',
	user: '',
})

const clearForm = () => {
	postTitle.value = ''
	postDescription.value = ''
}

const clearErrors = () => {
	fieldErrors.value = {
		title: '',
		description: '',
		user: '',
	}
}

const clearFieldErrors = () => {
	fieldErrors.value.title = ''
	fieldErrors.value.description = ''
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
	clearErrors()

	if (!userStore.user) {
		fieldErrors.value.user = 'Необходимо войти в аккаунт!!!!'

		return
	}

	if (!validateForm()) return

	try {
		await postsStore.addPost({
			title: postTitle.value,
			description: postDescription.value,
			userId: userStore.user.id,
		})
		;((postTitle.value = ''), (postDescription.value = ''))

		clearFieldErrors()
		isPostSubmitted.value = true
	} catch (err) {
		console.error('Что-то пошло не так', err)
	}
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/global/variables.scss';

.add-post-form {
	width: 100%;
	padding: 0.62rem 0.62rem 0.62rem 0.62rem;
	border: 1px solid #aaaaaa;
	border-radius: 0.5rem;
	display: flex;
	flex-direction: column;
	gap: 1rem;
	align-items: center;
	overflow: hidden;
	min-height: 18.75rem;
	position: relative;
	opacity: 0;

	animation: formAppearance 3s ease-in-out 1s forwards;

	&::before {
		content: '';
		position: absolute;
		inset: 0;
		background-image: url('/images/chat-banner-edited.jpg');
		background-position: center;
		background-size: cover;
		filter: blur(8px);
		transform: scale(1.05);
		z-index: 0;
	}

	@media (max-width: 48rem) {
		min-height: 12rem;
		gap: 0.3rem;
	}

	&__wrapper,
	&__global-error,
	&__clear-btn,
	&__submit-btn,
	&__go-to-text {
		position: relative;
		z-index: 1;
	}

	&__wrapper {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		align-items: center;
		margin-top: 1rem;
	}

	&__title {
		font-size: $px-24;
		line-height: 100%;
		color: $black;
	}

	&__submit-btn {
		padding: 0.5rem 0.5rem 0.5rem 0.5rem;

		@media (max-width: 48rem) {
			padding: 0.1rem 0.5rem;
			font-size: $px-14;
		}
	}

	&__clear-btn {
		color: $black;
	}

	&__go-to-text {
		font-size: $px-20;
		line-height: 110%;
		font-weight: 400;
		color: $apple;
		text-align: center;
	}

	&__blog-link {
		font-size: $px-20;
		line-height: 110%;
		color: $apple;

		transition: color $transition-300;

		&:hover,
		&:focus-visible {
			color: $black;
		}
	}

	&__user-error {
		z-index: 5;
		color: $black;
		font-weight: 600;
		font-size: $px-20;
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
		border: 2px solid $blue-grey;
		border-radius: 0.3rem;
		padding: 0.5rem 0.5rem 0.5rem 0.5rem;
		color: $black;
		background-color: transparent;

		transition: border-color $transition-300;

		&::placeholder {
			font-size: $px-14;
			line-height: 110%;
			color: $main;
		}
	}
}

.custom-textarea {
	width: 100%;
	$root: &;

	&__textarea {
		width: 100%;
		border: 2px solid $blue-grey;
		border-radius: 0.3rem;
		padding: 0.5rem 0.5rem 0.5rem 0.5rem;
		color: $black;
		font-size: $px-16;
		line-height: 110%;
		background-color: transparent;
		field-sizing: content;

		&::placeholder {
			font-size: $px-14;
			line-height: 110%;
			color: $main;
		}
	}
}

@keyframes formAppearance {
	0% {
		opacity: 0;
		clip-path: ellipse(0% 0% at 0% 50%);
	}

	25% {
		opacity: 1;
		clip-path: ellipse(43% 100% at 0% 50%);
	}

	50% {
		clip-path: ellipse(43% 100% at 50% 50%);
	}

	75% {
		clip-path: ellipse(43% 100% at 100% 50%);
	}

	100% {
		clip-path: ellipse(78% 100% at 51% 51%);
		opacity: 1;
	}
}
</style>
