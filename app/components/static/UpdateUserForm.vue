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
		<div class="update-user-form__avatar-preview" v-if="avatarPreviewUrl">
			<span class="update-user-form__preview-text"
				>Предпросмотр нового аватара:
			</span>
			<img
				class="update-user-form__preview-img"
				:src="avatarPreviewUrl"
				alt="Preview avatar"
				width="60"
				height="60"
			/>
		</div>
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
import { ref, computed, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '~/stores/userStore'
import type { UpdateUserPayload } from '~/types/UpdateUserType'

const userStore = useUserStore()
const route = useRoute()

const userId = Number(route.params.id)

const emit = defineEmits<{
	(e: 'saved'): void
	(e: 'cancel'): void
}>()

const userName = ref('')
const userSurName = ref('')
const userAvatarFile = ref<File | null>(null)
const isSubmitting = ref(false)
const avatarPreviewUrl = ref<string | null>(
	userStore.user?.avatarUrl || '/images/no-photo.webp',
)

const onAvatarChange = (event: Event) => {
	const target = event.target as HTMLInputElement
	const file = target.files?.[0] ?? null

	if (avatarPreviewUrl.value?.startsWith('blob:')) {
		URL.revokeObjectURL(avatarPreviewUrl.value)
	}

	userAvatarFile.value = file

	avatarPreviewUrl.value = file
		? URL.createObjectURL(file)
		: userStore.user?.avatarUrl || '/images/no-photo.webp'
}

const clearForm = () => {
	userName.value = ''
	userSurName.value = ''
	userAvatarFile.value = null
	avatarPreviewUrl.value = userStore.user?.avatarUrl || '/images/no-photo.webp'
}

const validateForm = () => {
	return (
		userName.value.trim().length >= 2 && userSurName.value.trim().length >= 2
	)
}

const updateUser = async (userId: number) => {
	// if (!validateForm()) return
	if (!userId || Number.isNaN(userId)) return

	const hasName = !!userName.value.trim()
	const hasSurName = !!userSurName.value.trim()
	const hasAvatar = !!userAvatarFile.value

	if (!hasName && !hasSurName && !hasAvatar) return

	isSubmitting.value = true

	try {
		let avatarUrl: string | null | undefined = undefined

		if (userAvatarFile.value) {
			avatarUrl = await userStore.uploadAvatar(userId, userAvatarFile.value)
		}

		const payload: UpdateUserPayload = {
			name: hasName ? userName.value.trim() : userStore.user?.name,
			surName: hasSurName ? userSurName.value.trim() : userStore.user?.surName,
			...(avatarUrl ? { avatarUrl } : {}),
		}

		await userStore.updateUser(userId, payload)
		clearForm()
		emit('saved')
	} finally {
		isSubmitting.value = false
	}
}

onBeforeUnmount(() => {
	if (avatarPreviewUrl.value?.startsWith('blob:')) {
		URL.revokeObjectURL(avatarPreviewUrl.value)
	}
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/global/variables.scss';

.update-user-form {
	width: 100%;
	$root: &;
	padding: 0.62rem 0.62rem 0.62rem 0.62rem;
	// border: 1px solid $primary;
	border: 1px solid var(--border);
	border-radius: 0.5rem;
	// background: $black;
	background: var(--surface);

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
				// color: $white;
				color: var(--text);
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
		// border: 1px solid $blue-grey;
		border: 1px solid var(--border);
		border-radius: 0.3rem;
		padding: 0.5rem 0.5rem 0.5rem 0.5rem;
		// color: $white;
		color: var(--text);
		background-color: transparent;

		transition: border-color $transition-300;

		&::placeholder {
			font-size: $px-14;
			line-height: 110%;
			// color: $white;
			color: var(--text-muted);
		}
	}

	&__avatar-preview {
		display: flex;
		align-items: center;
		gap: 0.3rem;

		@media (max-width: 25rem) {
			flex-direction: column;
		}
	}

	&__preview-img {
		border-radius: 50%;
		object-fit: cover;
		object-position: center;
		// border: 1px solid $blue-grey;
		border: 1px solid var(--border);
		overflow: hidden;
		display: block;
	}

	&__cancel-btn {
		width: 100%;
	}
}
</style>
