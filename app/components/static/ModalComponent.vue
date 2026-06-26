<template>
	<Teleport to="body">
		<Transition name="modal-fade">
			<div v-if="modalStore.isModalOpen" ref="overlayRef" class="modal-overlay">
				<form
					novalidate
					ref="modalWindow"
					@submit.prevent="submitForm"
					class="modal"
					:class="{ 'modal--active': modalStore.isModalOpen }"
				>
					<div class="modal__wrapper">
						<button
							class="modal__close-btn btn btn--transparent"
							aria-label="Закрыть окно регистрации/авторизации"
							type="button"
							@click="closeModal"
						>
							Х
						</button>
						<span class="modal__title">{{
							isRegistrationMode ? 'Вход в аккаунт' : 'Регистрация'
						}}</span>
						<div class="modal__main-wrapper" v-if="!userStore.isAuthenticated">
							<div class="modal__registration-block" v-if="isRegistrationMode">
								<div class="modal-input">
									<label for="email" class="modal-input__label"
										><svg
											class="modal-input__logo"
											width="18"
											height="18"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M21 3C21.5523 3 22 3.44772 22 4V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V19H20V7.3L12 14.5L2 5.5V4C2 3.44772 2.44772 3 3 3H21ZM8 15V17H0V15H8ZM5 10V12H0V10H5ZM19.5659 5H4.43414L12 11.8093L19.5659 5Z"
												fill="currentColor"
											/>
										</svg>
									</label>
									<input
										:class="{ 'modal-input__input--error': errors.email }"
										type="email"
										name="email"
										id="email"
										class="modal-input__input"
										v-model="emailInput"
										placeholder="Эл. почта"
										required
										autocomplete="email"
									/>
									<button
										class="modal-input__clear-input-btn btn btn--password"
										type="button"
										aria-label="Стереть содержимое формы"
										@click="clearMailInput"
									>
										<svg
											class="modal-input__clear-input-btn-icon"
											xmlns="http://www.w3.org/2000/svg"
											width="22"
											height="22"
											viewBox="0 0 32 32"
										>
											<path
												d="M16 0C7.164 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0m0 30.032C8.28 30.032 2 23.72 2 16S8.28 2 16 2s14 6.28 14 14-6.28 14.032-14 14.032m5.657-19.688a1 1 0 0 0-1.414 0l-4.242 4.242-4.242-4.242a1 1 0 1 0-1.415 1.414L14.586 16l-4.242 4.242a1 1 0 0 0 1.415 1.414l4.242-4.242 4.242 4.242a1 1 0 0 0 1.414-1.414L17.415 16l4.242-4.242a1 1 0 0 0 0-1.414"
											/>
										</svg>
									</button>
								</div>
								<div class="modal-input">
									<label for="name" class="modal-input__label">
										<svg
											class="modal-input__logo"
											width="18"
											height="18"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z"
												fill="currentColor"
											/>
										</svg>
									</label>
									<input
										:class="{ 'modal-input__input--error': errors.name }"
										type="text"
										name="name"
										id="name"
										class="modal-input__input"
										v-model="nameInput"
										placeholder="Имя"
										required
										autocomplete="given-name"
									/>
									<button
										class="modal-input__clear-input-btn btn btn--password"
										type="button"
										aria-label="Стереть содержимое формы"
										@click="clearNameInput"
									>
										<svg
											class="modal-input__clear-input-btn-icon"
											xmlns="http://www.w3.org/2000/svg"
											width="22"
											height="22"
											viewBox="0 0 32 32"
										>
											<path
												d="M16 0C7.164 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0m0 30.032C8.28 30.032 2 23.72 2 16S8.28 2 16 2s14 6.28 14 14-6.28 14.032-14 14.032m5.657-19.688a1 1 0 0 0-1.414 0l-4.242 4.242-4.242-4.242a1 1 0 1 0-1.415 1.414L14.586 16l-4.242 4.242a1 1 0 0 0 1.415 1.414l4.242-4.242 4.242 4.242a1 1 0 0 0 1.414-1.414L17.415 16l4.242-4.242a1 1 0 0 0 0-1.414"
											/>
										</svg>
									</button>
								</div>
								<div class="modal-input">
									<label for="surname" class="modal-input__label">
										<svg
											class="modal-input__logo"
											width="18"
											height="18"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z"
												fill="currentColor"
											/>
										</svg>
									</label>
									<input
										:class="{ 'modal-input__input--error': errors.surname }"
										type="text"
										name="surname"
										id="surname"
										class="modal-input__input"
										v-model="surnameInput"
										placeholder="Фамилия"
										required
										autocomplete="family-name"
									/>
									<button
										class="modal-input__clear-input-btn btn btn--password"
										type="button"
										aria-label="Стереть содержимое формы"
										@click="clearSurnameInput"
									>
										<svg
											class="modal-input__clear-input-btn-icon"
											xmlns="http://www.w3.org/2000/svg"
											width="22"
											height="22"
											viewBox="0 0 32 32"
										>
											<path
												d="M16 0C7.164 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0m0 30.032C8.28 30.032 2 23.72 2 16S8.28 2 16 2s14 6.28 14 14-6.28 14.032-14 14.032m5.657-19.688a1 1 0 0 0-1.414 0l-4.242 4.242-4.242-4.242a1 1 0 1 0-1.415 1.414L14.586 16l-4.242 4.242a1 1 0 0 0 1.415 1.414l4.242-4.242 4.242 4.242a1 1 0 0 0 1.414-1.414L17.415 16l4.242-4.242a1 1 0 0 0 0-1.414"
											/>
										</svg>
									</button>
								</div>
								<div class="modal-input">
									<label for="password" class="modal-input__label">
										<svg
											class="modal-input__logo"
											width="18"
											height="18"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M12.917 13C12.441 15.8377 9.973 18 7 18C3.68629 18 1 15.3137 1 12C1 8.68629 3.68629 6 7 6C9.973 6 12.441 8.16229 12.917 11H23V13H21V17H19V13H17V17H15V13H12.917ZM7 16C9.20914 16 11 14.2091 11 12C11 9.79086 9.20914 8 7 8C4.79086 8 3 9.79086 3 12C3 14.2091 4.79086 16 7 16Z"
												fill="currentColor"
											/>
										</svg>
									</label>
									<input
										:class="{ 'modal-input__input--error': errors.password }"
										:type="showPassword ? 'text' : 'password'"
										name="password"
										id="password"
										class="modal-input__input"
										v-model="passwordInput"
										placeholder="Пароль"
										required
										autocomplete="new-password"
									/>
									<button
										class="modal-input__toggle-password-btn btn btn--password"
										@mouseenter="showPassword = true"
										@mouseleave="showPassword = false"
										type="button"
										aria-label="Открыть/скрыть содержимое пароля"
									>
										<img
											v-if="inputType === 'password'"
											class="modal-input__toggle-password-icon"
											:src="
												showPassword
													? '/images/password-hide.png'
													: '/images/password-show.png'
											"
											alt="password-show-icon"
											width="20"
											height="20"
										/>
									</button>
								</div>
								<div class="modal-input">
									<label for="confirmPassword" class="modal-input__label">
										<svg
											class="modal-input__logo"
											width="18"
											height="18"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M12.917 13C12.441 15.8377 9.973 18 7 18C3.68629 18 1 15.3137 1 12C1 8.68629 3.68629 6 7 6C9.973 6 12.441 8.16229 12.917 11H23V13H21V17H19V13H17V17H15V13H12.917ZM7 16C9.20914 16 11 14.2091 11 12C11 9.79086 9.20914 8 7 8C4.79086 8 3 9.79086 3 12C3 14.2091 4.79086 16 7 16Z"
												fill="currentColor"
											/>
										</svg>
									</label>
									<input
										:class="{
											'modal-input__input--error': errors.confirmPassword,
										}"
										:type="inputType"
										name="confirmPassword"
										id="confirmPassword"
										class="modal-input__input"
										v-model="confirmPassword"
										placeholder="Подтвердите пароль"
										required
										autocomplete="new-password"
									/>
									<button
										class="modal-input__clear-input-btn btn btn--password"
										type="button"
										aria-label="Стереть содержимое формы"
										@click="clearConfirmPasswordInput"
									>
										<svg
											class="modal-input__clear-input-btn-icon"
											xmlns="http://www.w3.org/2000/svg"
											width="22"
											height="22"
											viewBox="0 0 32 32"
										>
											<path
												d="M16 0C7.164 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0m0 30.032C8.28 30.032 2 23.72 2 16S8.28 2 16 2s14 6.28 14 14-6.28 14.032-14 14.032m5.657-19.688a1 1 0 0 0-1.414 0l-4.242 4.242-4.242-4.242a1 1 0 1 0-1.415 1.414L14.586 16l-4.242 4.242a1 1 0 0 0 1.415 1.414l4.242-4.242 4.242 4.242a1 1 0 0 0 1.414-1.414L17.415 16l4.242-4.242a1 1 0 0 0 0-1.414"
											/>
										</svg>
									</button>
								</div>
							</div>
							<div class="modal__login-block" v-else>
								<div class="modal-input">
									<label for="email" class="modal-input__label">
										<svg
											class="modal-input__logo"
											width="18"
											height="18"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M21 3C21.5523 3 22 3.44772 22 4V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V19H20V7.3L12 14.5L2 5.5V4C2 3.44772 2.44772 3 3 3H21ZM8 15V17H0V15H8ZM5 10V12H0V10H5ZM19.5659 5H4.43414L12 11.8093L19.5659 5Z"
												fill="currentColor"
											/>
										</svg>
									</label>
									<input
										type="email"
										name="email"
										id="email"
										class="modal-input__input"
										v-model="emailInput"
										placeholder="Эл. почта"
										required
										autocomplete="email"
									/>
									<button
										class="modal-input__clear-input-btn btn btn--password"
										type="button"
										aria-label="Стереть содержимое формы"
										@click="clearMailInput"
									>
										<svg
											class="modal-input__clear-input-btn-icon"
											xmlns="http://www.w3.org/2000/svg"
											width="22"
											height="22"
											viewBox="0 0 32 32"
										>
											<path
												d="M16 0C7.164 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0m0 30.032C8.28 30.032 2 23.72 2 16S8.28 2 16 2s14 6.28 14 14-6.28 14.032-14 14.032m5.657-19.688a1 1 0 0 0-1.414 0l-4.242 4.242-4.242-4.242a1 1 0 1 0-1.415 1.414L14.586 16l-4.242 4.242a1 1 0 0 0 1.415 1.414l4.242-4.242 4.242 4.242a1 1 0 0 0 1.414-1.414L17.415 16l4.242-4.242a1 1 0 0 0 0-1.414"
											/>
										</svg>
									</button>
								</div>
								<div class="modal-input">
									<label for="password" class="modal-input__label">
										<svg
											class="modal-input__logo"
											width="18"
											height="18"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M12.917 13C12.441 15.8377 9.973 18 7 18C3.68629 18 1 15.3137 1 12C1 8.68629 3.68629 6 7 6C9.973 6 12.441 8.16229 12.917 11H23V13H21V17H19V13H17V17H15V13H12.917ZM7 16C9.20914 16 11 14.2091 11 12C11 9.79086 9.20914 8 7 8C4.79086 8 3 9.79086 3 12C3 14.2091 4.79086 16 7 16Z"
												fill="currentColor"
											/>
										</svg>
									</label>
									<input
										:type="showPassword ? 'text' : 'password'"
										name="password"
										id="password"
										class="modal-input__input"
										v-model="passwordInput"
										placeholder="Пароль"
										required
										autocomplete="current-password"
									/>
									<button
										class="modal-input__toggle-password-btn btn btn--password"
										@mouseenter="showPassword = true"
										@mouseleave="showPassword = false"
										type="button"
										aria-label="Открыть/скрыть содержимое пароля"
									>
										<img
											v-if="inputType === 'password'"
											class="modal-input__toggle-password-icon"
											:src="
												showPassword
													? '/images/password-hide.png'
													: '/images/password-show.png'
											"
											alt="password-show-icon"
											width="20"
											height="20"
										/>
									</button>
								</div>
							</div>
							<button
								class="modal__change-mode-btn btn"
								type="button"
								@click="changeMode"
							>
								{{
									isRegistrationMode ? 'У меня есть пароль' : 'Создать профиль'
								}}
							</button>
							<button
								class="modal__submit-btn btn btn--transparent"
								type="submit"
								:disabled="isSubmitting"
							>
								{{
									isSubmitting
										? 'Подождите...'
										: isRegistrationMode
											? 'Создать аккаунт'
											: 'Войти в аккаунт'
								}}
							</button>
							<span class="modal__global-error" v-if="errors">{{
								formErrorMessage
							}}</span>
						</div>
						<div class="modal__auth-complete" v-else>
							<span class="modal__success">Вы уже авторизованы!</span>
							<button
								class="modal__logout-btn btn btn--transparent"
								type="button"
								@click="handleLogout"
							>
								Выйти из аккаунта
							</button>
						</div>
					</div>
				</form>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup lang="ts">
import { ref, useTemplateRef, computed, onMounted } from 'vue'
import { useModalStore } from '~/stores/modalStore'
import { useUserStore } from '@/stores/userStore'
import { onClickOutside, type MaybeElementRef } from '@vueuse/core'

const modalStore = useModalStore()
const userStore = useUserStore()

const isRegistrationMode = ref(true)
const isSubmitting = ref(false)
const inputType = ref('password')
const showPassword = ref(false)

// таргет для onClickOutside - настроен также на html эл-те
const target = useTemplateRef('modalWindow')

const emailInput = ref('')
const passwordInput = ref('')
const confirmPassword = ref('')
const nameInput = ref('')
const surnameInput = ref('')

const clearMailInput = () => {
	emailInput.value = ''
}

const clearNameInput = () => {
	nameInput.value = ''
}

const clearSurnameInput = () => {
	surnameInput.value = ''
}

const clearConfirmPasswordInput = () => {
	confirmPassword.value = ''
}

const errors = ref({
	email: '',
	password: '',
	name: '',
	surname: '',
	confirmPassword: '',
	form: '',
})

const formErrorMessage = computed(() => {
	return (
		errors.value.email ||
		errors.value.password ||
		errors.value.name ||
		errors.value.surname ||
		errors.value.confirmPassword ||
		errors.value.form ||
		''
	)
})

const clearErrors = () => {
	errors.value = {
		email: '',
		password: '',
		name: '',
		surname: '',
		confirmPassword: '',
		form: '',
	}
}

const clearForm = () => {
	emailInput.value = ''
	passwordInput.value = ''
	confirmPassword.value = ''
	nameInput.value = ''
	surnameInput.value = ''
	clearErrors()
	showPassword.value = false
}

const closeModal = () => {
	modalStore.closeModal()
	clearForm()
	showPassword.value = false
}

const changeMode = () => {
	isRegistrationMode.value = !isRegistrationMode.value
	clearForm()
	showPassword.value = false
}

const handleLogout = async () => {
	await userStore.logout()
	closeModal()
	showPassword.value = false
	navigateTo('/')
}

const validateForm = () => {
	clearErrors()

	let valid = true

	if (!emailInput.value.trim()) {
		errors.value.email = 'Введите email'
		valid = false
	}

	if (!passwordInput.value.trim()) {
		errors.value.password = 'Введите пароль'
		valid = false
	} else if (passwordInput.value.length < 6) {
		errors.value.password = 'Пароль минимум 6 символов'
		valid = false
	}

	if (isRegistrationMode.value) {
		if (!nameInput.value.trim()) {
			errors.value.name = 'Введите имя'
			valid = false
		}

		if (!surnameInput.value.trim()) {
			errors.value.surname = 'Введите фамилию'
			valid = false
		}

		if (!confirmPassword.value.trim()) {
			errors.value.confirmPassword = 'Введите пароль'
			valid = false
		} else if (confirmPassword.value !== passwordInput.value) {
			errors.value.confirmPassword = 'Пароли не совпадают'
			valid = false
		}
	}

	return valid
}

const submitForm = async () => {
	if (!validateForm() || isSubmitting.value) return

	isSubmitting.value = true
	clearErrors()

	try {
		const url = isRegistrationMode.value
			? '/api/auth/register'
			: '/api/auth/login'

		const body = isRegistrationMode.value
			? {
					name: nameInput.value,
					surName: surnameInput.value,
					email: emailInput.value,
					password: passwordInput.value,
					confirmPassword: confirmPassword.value,
				}
			: {
					email: emailInput.value,
					password: passwordInput.value,
				}

		const res = await $fetch(url, {
			method: 'POST',
			body,
		})

		userStore.setUser(res as any)
		modalStore.closeModal()
	} catch (error: any) {
		const data = error?.data

		if (data?.fieldErrors) {
			errors.value.email = data.fieldErrors.email || ''
			errors.value.password = data.fieldErrors.password || ''
			errors.value.name = data.fieldErrors.name || ''
			errors.value.surname = data.fieldErrors.surname || ''
			errors.value.confirmPassword = data.fieldErrors.confirmPassword || ''
			errors.value.form = data.fieldErrors.form || data.statusMessage || ''
		} else {
			errors.value.form =
				data?.statusMessage || data?.message || 'Ошибка авторизации'
		}
	} finally {
		isSubmitting.value = false
		showPassword.value = false
	}
}

onMounted(() => {
	onClickOutside(target as MaybeElementRef, () => {
		if (modalStore.isModalOpen) closeModal()
	})
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/global/variables';

.modal-overlay {
	position: fixed;
	inset: 0;
	z-index: 100;
	background: rgba(0, 0, 0, 0.4);
	display: grid;
	place-items: center;
	padding: 1rem;
}

.modal {
	$root: &;
	max-width: 27.25rem;
	width: 100%;
	min-height: 10rem;
	border: 1px solid $blue-grey;
	border-radius: 0.5rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: $green-deep;

	position: absolute;
	top: 20%;
	right: 50%;
	left: 50%;
	transform: translateX(-50%);

	opacity: 0;
	pointer-events: none;
	clip-path: polygon(100% 50%, 100% 50%, 0% 50%, 0% 50%);

	transition:
		opacity $transition-300,
		clip-path $transition-300;

	&__close-btn {
		position: absolute;
		top: 6%;
		right: 2%;
		color: $white;
	}

	&__wrapper {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
		width: 100%;
		padding: 1rem 1rem 1rem 1rem;
		position: relative;
	}

	&__main-wrapper {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
		width: 100%;
	}

	&__title {
		font-size: $px-24;
		line-height: 110%;
		font-weight: 700;
	}

	&__registration-block,
	&__login-block {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
	}

	&__submit-btn {
		width: 100%;
	}

	&__auth-complete {
		display: flex;
		flex-direction: column;
		gap: 0.62rem;
		align-items: center;
		height: 100%;
		min-height: 5.25rem;
	}

	&__logout-btn {
		margin-top: auto;
	}

	&__global-error {
		color: red;
		font-size: $px-20;
		text-align: center;
	}

	&__success {
		font-size: $px-20;
	}

	&--active {
		opacity: 1;
		pointer-events: all;
		clip-path: polygon(100% 0%, 100% 100%, 0% 100%, 0% 0%);
		z-index: 20;
	}
}

.modal-input {
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
		padding: 0.2rem 1.5rem 0.2rem 1.5rem;
		color: $main;

		transition: border-color $transition-300;

		&::placeholder {
			font-size: $px-12;
			line-height: 110%;
		}

		@media (max-width: 48rem) {
			font-size: $px-14;

			&::placeholder {
				font-size: $px-10;
			}
		}

		&:placeholder-shown {
			+ #{$root}__clear-input-btn {
				opacity: 0;
			}
		}
	}

	&__clear-input-btn {
		position: absolute;
		top: 48%;
		transform: translateY(-50%);
		right: 1.7%;
		opacity: 1;
		scale: 0.8;

		transition: opacity $transition-300;

		&:hover,
		&:focus-visible {
			#{$root}__clear-input-btn-icon {
				animation: clearBtnRotate 0.5s ease-in infinite;
			}
		}
	}

	&__clear-input-btn-icon {
		transition: transform $transition-300;
	}

	&__input--error {
		border: 1px solid $red;
		outline: 3px solid $red;
	}

	&__toggle-password-btn {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		right: 2%;
		z-index: 5;
	}
}

.modal-fade-enter-active,
.modal-fade-leave-active {
	transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
	opacity: 0;
}

.modal-fade-enter-to,
.modal-fade-leave-from {
	opacity: 1;
}

@keyframes clearBtnRotate {
	0% {
		transform: rotate(0deg);
	}

	25% {
		transform: rotate(20deg);
	}

	50% {
		transform: rotate(0deg);
	}

	75% {
		transform: rotate(20deg);
	}

	100% {
		transform: rotate(0deg);
	}
}
</style>
