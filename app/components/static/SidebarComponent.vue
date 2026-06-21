<template>
	<aside
		class="sidebar"
		:class="{ 'sidebar--active': isSidebarOpen, 'sidebar--mobile': !isDesktop }"
	>
		<button
			class="sidebar__open-btn btn btn--sidebar"
			type="button"
			aria-label="Открыть/закрыть боковое меню"
			@click="openSidebar"
		>
			<svg
				class="sidebar__open-btn-icon"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M21.97 15V9C21.97 4 19.97 2 14.97 2H8.96997C3.96997 2 1.96997 4 1.96997 9V15C1.96997 20 3.96997 22 8.96997 22H14.97C19.97 22 21.97 20 21.97 15Z"
					stroke="#292D32"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M14.97 2V22"
					stroke="#292D32"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M7.96997 9.43994L10.53 11.9999L7.96997 14.5599"
					stroke="#292D32"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</button>
		<div class="sidebar__wrapper">
			<div class="sidebar__links-menu">
				<NuxtLink
					class="sidebar__link"
					aria-label="Переход на главную страницу"
					:to="'/'"
				>
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M4 21V18.5C4 15.4624 6.46243 13 9.5 13H12.8513C15.307 13 17.4651 11.3721 18.1397 9.01097L18.7454 6.89097C18.8961 6.3636 19.3781 6 19.9266 6C20.7258 6 21.3122 6.75106 21.1184 7.5264L19.3638 14.5448C19.15 15.4 18.3816 16 17.5 16M8 21V18M16 6.5C16 8.70914 14.2091 10.5 12 10.5C9.79086 10.5 8 8.70914 8 6.5C8 4.29086 9.79086 2.5 12 2.5C14.2091 2.5 16 4.29086 16 6.5Z"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-width="1.4"
						/>
					</svg>
					<span class="sidebar__link-text">На&nbsp;главную</span></NuxtLink
				>
				<NuxtLink
					class="sidebar__link"
					aria-label="Переход страницу блога"
					:to="'/blog'"
				>
					<svg
						class="sidebar__link-icon"
						xmlns="http://www.w3.org/2000/svg"
						xml:space="preserve"
						viewBox="0 0 512 512"
						width="20"
						height="20"
					>
						<path
							d="M293.186 307.184h131.572V420.17H293.186zM87.243 308.893h154.448v17.162H87.243zM87.243 401.298h154.448v17.162H87.243zM87.243 355.1h154.448v17.162H87.243z"
						/>
						<path
							d="M416.428.004H95.58C42.787.013.016 42.792 0 95.577v303.685c.025 62.262 50.463 112.717 112.742 112.734h286.524c62.27-.017 112.717-50.464 112.734-112.734V95.577C511.992 42.792 469.212.013 416.428.004m48.377 399.258c-.008 18.15-7.308 34.424-19.198 46.34-11.916 11.891-28.19 19.19-46.34 19.198H112.742c-18.15-.009-34.433-7.308-46.348-19.198-11.892-11.916-19.182-28.19-19.198-46.34V118.696h417.61v280.566z"
						/>
						<path
							d="M88.96 267.908h34.583c19.71 0 31.642-8.581 31.642-26.548 0-10.852-6.167-18.368-12.2-20.648v-.268c6.034-3.352 10.592-9.519 10.592-19.432 0-14.489-9.251-24.268-29.086-24.268H88.96c-.796 0-1.332.536-1.332 1.34v88.475c0 .812.536 1.349 1.332 1.349m18.378-74.413c0-.528.251-.804.804-.804h13.944c7.5 0 11.925 3.888 11.925 10.584 0 6.712-4.425 10.734-11.925 10.734h-13.944c-.553 0-.804-.268-.804-.804zm0 36.46c0-.528.251-.795.804-.795h15c8.061 0 12.343 4.424 12.343 11.405 0 7.097-4.282 11.396-12.343 11.396h-15c-.553 0-.804-.276-.804-.812zM181.516 267.908h59.404c.796 0 1.332-.536 1.332-1.349v-14.874c0-.813-.536-1.341-1.332-1.341h-40.224c-.544 0-.804-.268-.804-.812v-71.447c0-.804-.528-1.34-1.341-1.34h-17.036c-.805 0-1.332.536-1.332 1.34v88.475c0 .811.528 1.348 1.333 1.348M292.708 269.374c15.963 0 28.558-7.366 33.251-22.115 2.011-6.301 2.539-11.396 2.539-24.938s-.528-18.637-2.539-24.939c-4.693-14.739-17.288-22.114-33.251-22.114-15.956 0-28.558 7.375-33.243 22.114-2.02 6.302-2.556 11.397-2.556 24.939s.536 18.637 2.556 24.938c4.684 14.75 17.287 22.115 33.243 22.115m-14.347-66.628c2.011-6.301 6.847-10.055 14.346-10.055 7.508 0 12.335 3.754 14.346 10.055 1.073 3.226 1.474 7.634 1.474 19.576 0 11.924-.402 16.357-1.474 19.567-2.011 6.31-6.838 10.072-14.346 10.072-7.5 0-12.335-3.763-14.346-10.072-1.064-3.21-1.475-7.643-1.475-19.567 0-11.942.411-16.35 1.475-19.576M387.961 269.374c16.081 0 28.685-8.171 33.251-22.794 1.6-4.952 2.263-12.46 2.263-20.505v-7.517c0-.788-.536-1.333-1.332-1.333h-31.366c-.813 0-1.349.545-1.349 1.333v12.888c0 .796.536 1.332 1.349 1.332h12.326c.536 0 .805.277.805.805 0 3.879-.403 6.703-1.073 8.991-1.878 6.026-7.777 9.386-14.614 9.386-7.91 0-12.88-3.763-14.891-10.072-1.064-3.21-1.466-7.643-1.466-19.567 0-11.941.402-16.223 1.466-19.441 2.011-6.302 6.847-10.19 14.631-10.19 7.5 0 12.05 3.218 15.678 9.385.269.67.939.939 1.886.67l14.338-6.033c.796-.402.947-1.206.536-2.019-4.299-10.995-15.419-19.425-32.439-19.425-16.232 0-28.835 7.375-33.527 22.114-2.012 6.302-2.556 11.397-2.556 24.939s.545 18.637 2.556 24.938c4.693 14.75 17.297 22.115 33.528 22.115"
						/>
					</svg>
					<span class="sidebar__link-text">Блог</span>
				</NuxtLink>
				<NuxtLink
					class="sidebar__link"
					aria-label="Переход на страницу пользователя"
					:to="profileTo"
				>
					<svg
						class="sidebar__link-icon"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z"
							fill="currentColor"
						/>
					</svg>
					<span class="sidebar__link-text">Профиль</span></NuxtLink
				>
				<NuxtLink
					class="sidebar__link"
					aria-label="Понравившиеся"
					@click="toLikedPage"
				>
					<svg
						class="sidebar__link-icon"
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						fill="none"
						viewBox="0 0 24 24"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M10.75 2.45c.69-.59 1.82-.59 2.52 0l1.58 1.36c.3.26.86.47 1.26.47h1.7c1.06 0 1.93.87 1.93 1.93v1.7c0 .39.21.96.47 1.26l1.36 1.58c.59.69.59 1.82 0 2.52l-1.36 1.58c-.26.3-.47.86-.47 1.26v1.7c0 1.06-.87 1.93-1.93 1.93h-1.7c-.39 0-.96.21-1.26.47l-1.58 1.36c-.69.59-1.82.59-2.52 0l-1.58-1.36c-.3-.26-.86-.47-1.26-.47H6.18c-1.06 0-1.93-.87-1.93-1.93V16.1c0-.39-.21-.95-.46-1.25l-1.35-1.59c-.58-.69-.58-1.81 0-2.5l1.35-1.59c.25-.3.46-.86.46-1.25V6.21c0-1.06.87-1.93 1.93-1.93h1.73c.39 0 .96-.21 1.26-.47z"
						/>
						<path
							stroke="currentColor"
							stroke-miterlimit="10"
							stroke-width="1.5"
							d="m9.89 14.82 1.45 1.12c.19.19.61.28.89.28H14c.56 0 1.17-.42 1.31-.98l1.12-3.42c.23-.65-.19-1.22-.89-1.22h-1.87c-.28 0-.51-.23-.47-.56l.23-1.5c.09-.42-.19-.89-.61-1.03-.37-.14-.84.05-1.03.33l-1.92 2.85"
						/>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M7.5 14.82v-4.58c0-.66.28-.89.94-.89h.47c.65 0 .94.23.94.89v4.58c0 .65-.28.89-.94.89h-.47c-.66 0-.94-.23-.94-.89"
						/>
					</svg>
					<span class="sidebar__link-text">Понравившиеся</span></NuxtLink
				>
			</div>
			<button
				class="sidebar__login-btn btn btn--modal"
				type="button"
				aria-label="Открыть меню регистрации"
				@click="openModal"
			>
				<span class="sidebar__login-btn-text" v-if="isSidebarOpen || !isDesktop"
					>Вход в аккаунт</span
				>
				<svg
					v-else
					class="sidebar__login-btn-icon"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z"
						fill="currentColor"
					/>
				</svg>
			</button>
		</div>
	</aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '~/stores/userStore'
import { useModalStore } from '~/stores/modalStore'

const userStore = useUserStore()
const modalStore = useModalStore()

const isSidebarOpen = ref(false)
const isDesktop = ref(true)

const profileTo = computed(() => {
	return userStore.user ? `/user/${userStore.user?.id}` : '/'
})

const openSidebar = () => {
	isSidebarOpen.value = !isSidebarOpen.value
}

const mobileChangeUi = () => {
	isDesktop.value = window.innerWidth > 768
}

const openModal = () => {
	modalStore.openModal()
}

const toLikedPage = () => {
	if (!userStore.user)
		return alert(
			'Не авторизованные пользователи не могут смотреть понравившиеся посты',
		)
	else {
		navigateTo('/liked')
	}
}

onMounted(() => {
	mobileChangeUi()
	window.addEventListener('resize', mobileChangeUi)
})

onUnmounted(() => {
	window.removeEventListener('resize', mobileChangeUi)
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/global/variables';

.sidebar {
	width: 3.5rem;
	min-height: 14rem;
	padding: 1rem 1rem 1rem 1rem;
	border: 1px solid $apple;
	border-radius: 0.62rem;
	background: $light-white;
	$root: &;

	transition: width $transition-300;

	&__logo {
		color: $black;
	}

	&__wrapper {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	&__links-menu {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	&__link {
		font-size: $px-18;
		font-weight: 400;
		color: $black;
		display: flex;
		align-items: center;
		gap: 0.3rem;

		transition: transform $transition-300;

		&:hover,
		&:focus-visible {
			transform: translateX(0.3rem);
			border: unset;
		}
	}

	&__link-text {
		opacity: 0;
		transition: opacity $transition-300;
	}

	&__login-btn {
		color: $black;

		padding: 0.5rem 0.5rem;
		svg {
			color: $black;
		}
	}

	&__open-btn {
		transition:
			opacity $transition-300,
			scale $transition-300;
	}

	&--active {
		width: 100%;

		#{$root}__link-text {
			opacity: 1;
		}
	}

	&--mobile {
		grid-column: span 2;
		min-height: unset;
		width: 100%;

		#{$root}__open-btn {
			opacity: 0;
			pointer-events: none;
			display: none;
		}

		#{$root}__wrapper {
			align-items: center;
			gap: 1rem;
			justify-content: space-between;
			width: 100%;
		}

		#{$root}__links-menu {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			gap: 0.62rem;
			width: 100%;
			flex-wrap: wrap;

			@media (max-width: 25rem) {
				flex-direction: column;
				gap: 0.3rem;
				flex-wrap: nowrap;
			}
		}

		#{$root}__link-text {
			opacity: 1;
		}
	}

	svg {
		aspect-ratio: 16/9;
	}
}

.router-link-active {
	transition: all $transition-300;
	color: $primary;
	pointer-events: none;
}
</style>
