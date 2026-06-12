<template>
	<section class="profile" v-if="userStore.user && !loading">
		<div class="container">
			<div class="profile__main-wrapper">
				<div class="profile__main">
					<h1 class="profile__main-title">Информация аккаунта:</h1>
					<div class="profile__wrapper">
						<div class="profile__heading">
							<h2 class="profile__email">
								Поч. адрес: <b>{{ userStore.user?.email }}</b>
							</h2>
						</div>
						<div class="profile__info">
							<p class="profile__name">
								Имя: <b>{{ userStore.user?.name }}</b>
							</p>
							<span class="profile__surname"
								>Фамилия: <b>{{ userStore.user?.surName }}</b></span
							>
						</div>
						<span class="profile__created-at"
							>Создан: <b>{{ dateFormatted }}</b></span
						>
						<svg
							class="profile__picture"
							width="40"
							height="40"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M4 21V18.5C4 15.4624 6.46243 13 9.5 13H12.8513C15.307 13 17.4651 11.3721 18.1397 9.01097L18.7454 6.89097C18.8961 6.3636 19.3781 6 19.9266 6C20.7258 6 21.3122 6.75106 21.1184 7.5264L19.3638 14.5448C19.15 15.4 18.3816 16 17.5 16M8 21V18M16 6.5C16 8.70914 14.2091 10.5 12 10.5C9.79086 10.5 8 8.70914 8 6.5C8 4.29086 9.79086 2.5 12 2.5C14.2091 2.5 16 4.29086 16 6.5Z"
								stroke="#000000"
								stroke-linecap="round"
								stroke-width="1.4"
							/>
						</svg>
					</div>
					<button
						class="profile__update-account-btn btn btn--transparent"
						type="button"
						@click="updateAccount"
					>
						{{ isUpdating ? 'Обновляем...' : 'Редактировать профиль' }}
					</button>
					<button
						class="profile__logout-btn btn"
						type="button"
						aria-label="Выйти из аккаунта"
						@click="logout"
					>
						Выйти из аккаунта
					</button>
					<UpdateUserForm
						v-if="isUpdating"
						@saved="closeUpdateForm"
						@cancel="closeUpdateForm"
					/>
				</div>
				<div class="profile__user-posts">
					<span class="profile__posts-count"
						>Всего постов написано: {{ postsStore.posts.length }}</span
					>
					<div class="profile__posts" v-if="postsStore.posts.length !== 0">
						<PostComponent
							v-for="post in postsStore.posts"
							:key="post.id"
							:post="post"
							:show-comments-immediately="true"
						/>
					</div>
				</div>
				<AddPostForm />
				<button
					class="profile__delete-profile-btn btn btn--transparent"
					type="button"
					aria-label="Удалить аккаунт"
					@click="deleteAccount"
				>
					Удалить аккаунт?
				</button>
			</div>
		</div>
	</section>

	<LoaderImg v-else />

	<UpBtn />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '~/stores/userStore'
import { usePostsStore } from '~/stores/postsStore'
import AddPostForm from '~/app/components/static/AddPostForm.vue'
import PostComponent from '~/app/components/static/PostComponent.vue'
import LoaderImg from '~/app/components/static/LoaderImg.vue'
import UpBtn from '~/app/components/static/UpBtn.vue'
import UpdateUserForm from '~/app/components/static/UpdateUserForm.vue'

const userStore = useUserStore()
const postsStore = usePostsStore()

const isUpdating = ref(false)
const loading = ref(false)

useHead({
	title: computed(() =>
		userStore.user
			? `${userStore.user.name} ${userStore.user.surName}`
			: 'Профиль пользователя',
	),
})

definePageMeta({
	middleware: 'auth',
})

const logout = async () => {
	const ok = confirm('Действительно выйти из аккаунта?')
	if (!ok) return
	await userStore.logout().then(navigateTo('/'))
}

const deleteAccount = async () => {
	const userId = userStore.user?.id
	if (!userId) return

	const ok = confirm(
		'Удалить аккаунт? При выполнении данного действия будут удалены все ваши посты, реакции и комментарии на посты других людей',
	)

	if (!ok) return

	await userStore.deleteUser(userId)
	postsStore.clearPostsState()
	await navigateTo('/')
}

const dateFormatted = computed(() => {
	const userCreated = userStore.user?.createdAt
	const date = new Date(String(userCreated))

	const formatter = new Intl.DateTimeFormat('ru-ru', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	})

	const dateHours = String(date.getHours()).padStart(2, '0')
	const dateMinutes = String(date.getMinutes()).padStart(2, '0')

	return `${formatter.format(date)} | ${dateHours}:${dateMinutes}`
})

const updateAccount = async () => {
	isUpdating.value = true
}

const closeUpdateForm = () => {
	isUpdating.value = false
}

onMounted(async () => {
	loading.value = true

	try {
		if (userStore.user?.id) {
			await postsStore.fetchUserPosts(userStore.user.id)
		}
	} catch (err) {
		console.error(err)
	} finally {
		loading.value = false
	}
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/global/variables';

.profile {
	$root: &;

	&__main-wrapper {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
	}

	&__main {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1.12rem;
	}

	&__main-title {
		font-size: $px-30;
		line-height: 110%;
		letter-spacing: 0.02em;
		text-align: center;

		@media (max-width: 48rem) {
			font-size: $px-22;
		}
	}

	&__wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.62rem;
		padding: 0.5rem 0.5rem 0.5rem 0.5rem;
		border: 1px solid $white;
		border-radius: 0.5rem;
		width: 100%;

		position: relative;
	}

	&__heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.62rem;
	}

	&__email,
	&__name,
	&__title,
	&__surname,
	&__created-at {
		font-size: $px-20;
		line-height: 110%;
		letter-spacing: 0.01em;
		color: $purple-deep;

		b {
			color: $white;
		}
	}

	&__info {
		display: flex;
		flex-direction: column;
		gap: 0.62rem;
	}

	&__picture {
		position: absolute;
		bottom: 2%;
		right: 2%;

		width: 4rem;
		height: 4rem;

		@media (max-width: 31.25rem) {
			display: none;
		}
	}

	&__user-posts {
		display: flex;
		flex-direction: column;
		gap: 0.62rem;
	}

	&__posts {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 0.62rem;
	}
}
</style>
