<template>
	<article class="update-user-form">
		<form @submit.prevent="updateUser(userId)" class="update-user-form__form">
			<div class="update-user-form__input-block">
				<label for="userName" class="update-user-form__label">Новое имя</label>
				<input
					type="text"
					id="userName"
					name="userName"
					class="update-user-form__input"
					v-model="userName"
					placeholder="Ваше новое имя"
					minlength="3"
					maxlength="20"
				/>
			</div>
			<div class="update-user-form__input-block">
				<label for="userSurName" class="update-user-form__label"
					>Новая фамилия</label
				>
				<input
					type="text"
					id="userSurName"
					name="userSurName"
					class="update-user-form__input"
					v-model="userSurName"
					placeholder="Ваша новая фамилия"
					minlength="3"
					maxlength="20"
				/>
			</div>
			<div class="update-user-form__input-block">
				<label for="userAvatar" class="update-user-form__label"
					>Новый аватар</label
				>
				<input
					type="file"
					id="userAvatar"
					name="userAvatar"
					class="update-user-form__input"
					accept="image/*"
					@change="onAvatarChange"
				/>
			</div>
			<button
				class="update-user-form__submit-btn btn btn--transparent"
				aria-label="Обновить ваши данные"
				type="submit"
				:disabled="isSubmitting"
			>
				{{ isSubmitting ? 'Сохранение...' : 'Обновить профиль' }}
			</button>
		</form>
		<button
			class="update-user-form__cancel-btn btn btn--transparent"
			type="button"
			aria-label="Отменить обновление профиля"
			@click="emit('cancel')"
		>
			{{ isSubmitting ? 'Отмена...' : 'Отменить обновление' }}
		</button>
	</article>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '~/stores/userStore'
import type { UpdateUserPayload } from '~/types/UpdateUserType'

const userName = ref('')
const userSurName = ref('')
const userAvatarFile = ref<File | null>(null)
const isSubmitting = ref(false)

const userStore = useUserStore()
const route = useRoute()

const userId = Number(route.params.id)

const emit = defineEmits<{
	(e: 'saved'): void
	(e: 'cancel'): void
}>()

const onAvatarChange = (event: Event) => {
	const target = event.target as HTMLInputElement
	const file = target.files?.[0] ?? null
	userAvatarFile.value = file
}

const clearForm = () => {
	userName.value = ''
	userSurName.value = ''
	userAvatarFile.value = null
}

const validateForm = () => {
	return (
		userName.value.trim().length >= 2 && userSurName.value.trim().length >= 2
	)
}

const updateUser = async (userId: number) => {
	if (!validateForm()) return
	if (!userId || Number.isNaN(userId)) return

	isSubmitting.value = true

	try {
		const payload: UpdateUserPayload = {
			name: userName.value.trim(),
			surName: userSurName.value.trim(),
			avatarUrl: null,
		}

		await userStore.updateUser(userId, payload)
		clearForm()
		emit('saved')
	} finally {
		isSubmitting.value = false
	}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/global/variables.scss';

.update-user-form {
	width: 100%;
	$root: &;
	padding: 0.62rem 0.62rem 0.62rem 0.62rem;
	border: 1px solid $primary;
	border-radius: 0.5rem;
	background: $black;

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

	&__form {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.62rem;

		@media (max-width: 64rem) {
			grid-template-columns: 1fr;
		}
	}

	&__submit-btn {
		@media (max-width: 48rem) {
			padding: 0.1rem 0.5rem;
			font-size: $px-14;
		}
	}

	&__input-block {
		width: 100%;
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 0.62rem;
		align-items: flex-start;

		&:hover,
		&:focus-within {
			#{$root}__label {
				color: $white;
			}
		}
	}

	&__label {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		right: 2%;

		transition: color $transition-300;

		@media (max-width: 31.25rem) {
			position: static;
			transform: none;
		}
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

	&__cancel-btn {
		width: 100%;
	}
}
</style>
