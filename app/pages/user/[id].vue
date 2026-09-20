<template>
	<main class="profile-page">
		<section class="profile" v-if="userStore.user && !loading">
			<div class="container">
				<div class="profile__main-wrapper">
					<div class="profile__main">
						<!-- <h1 class="profile__main-title">Информация аккаунта:</h1> -->
						<div class="profile__wrapper">
							<img
								class="profile__user-photo"
								:src="userStore.user?.avatarUrl || '/images/no-photo.webp'"
								alt="Profile photo"
								width="150"
								height="150"
								aria-label="Фото профиля"
							/>
							<div class="profile__inner-wrapper">
								<div class="profile__info">
									<div class="profile__info-inner">
										<p class="profile__name">
											<b>{{ userStore.user?.name }}</b>
										</p>
										<span class="profile__surname"
											><b>{{ userStore.user?.surName }}</b></span
										>
									</div>
								</div>
								<div class="profile__heading">
									<h2 class="profile__email">
										<b>{{ userStore.user?.email }}</b>
									</h2>
								</div>
								<span class="profile__created-at"
									><span class="profile__created-at-inner"
										>На платформе с: </span
									><b>{{ dateFormatted }}</b></span
								>
								<svg
									class="profile__picture-first"
									width="90"
									height="90"
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
								<svg
									class="profile__picture-second"
									width="90"
									height="90"
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
							</div>
							<button
								class="profile__update-account-btn btn btn--transparent"
								type="button"
								@click="updateAccount"
							>
								<span class="profile__updating-text" v-if="isUpdating"
									>Обновляем..</span
								>
								<svg
									v-else
									class="profile__settings-icon"
									xmlns="http://www.w3.org/2000/svg"
									width="25"
									height="25"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										cx="12"
										cy="12"
										r="3"
										stroke="currentColor"
										stroke-width="1.5"
									/>
									<path
										stroke="currentColor"
										stroke-width="1.5"
										d="M13.7654 2.15224C13.3978 2 12.9319 2 12 2s-1.3978 0-1.7654.15224a2 2 0 0 0-1.08237 1.08239c-.09266.22371-.12893.48387-.14312.86336-.02085.55769-.30685 1.0739-.79017 1.35294-.4833.27903-1.07335.26861-1.56675.00783-.33574-.17746-.57918-.27614-.81925-.30774a2 2 0 0 0-1.47858.39618c-.31562.24218-.54859.6457-1.01453 1.45273s-.69891 1.21055-.75084 1.60498a2 2 0 0 0 .39619 1.47859c.14738.1921.35452.3535.67601.5555.47261.297.7767.8029.77667 1.361s-.30411 1.0639-.77668 1.3608c-.32153.2021-.5287.3636-.6761.5557a1.9998 1.9998 0 0 0-.39618 1.4785c.05192.3944.28489.798.75083 1.605s.69892 1.2106 1.01453 1.4527a2.0002 2.0002 0 0 0 1.47858.3962c.24005-.0316.48348-.1303.8192-.3077.49343-.2608 1.08352-.2712 1.56686.0078.48334.2791.76936.7953.79021 1.3531.0142.3794.05046.6396.14312.8633.20299.49.59234.8794 1.08237 1.0824C10.6022 22 11.0681 22 12 22s1.3978 0 1.7654-.1522c.49-.203.8794-.5924 1.0823-1.0824.0927-.2237.129-.4839.1432-.8634.0208-.5577.3068-1.0739.7901-1.353s1.0734-.2686 1.5669-.0078c.3357.1774.5791.276.8191.3076a1.9997 1.9997 0 0 0 1.4786-.3961c.3156-.2422.5486-.6457 1.0145-1.4528.466-.807.699-1.2105.7509-1.6049a2.0002 2.0002 0 0 0-.3962-1.4786c-.1474-.1921-.3546-.3536-.6761-.5556-.4725-.2969-.7766-.8028-.7766-1.3609s.3041-1.0638.7766-1.3607c.3216-.2021.5288-.3635.6762-.5557a2 2 0 0 0 .3962-1.47853c-.0519-.39442-.2849-.79794-.7509-1.60497-.4659-.80703-.6989-1.21055-1.0145-1.45273a2 2 0 0 0-1.4786-.39618c-.24.0316-.4834.13027-.8192.30771-.4934.26079-1.0835.27122-1.5668-.00784-.4834-.27905-.7694-.7953-.7902-1.35302-.0142-.37946-.0505-.63961-.1432-.86331a1.9998 1.9998 0 0 0-1.0823-1.08239Z"
									/>
								</svg>
							</button>
						</div>
						<button
							class="profile__logout-btn btn"
							type="button"
							aria-label="Выйти из аккаунта"
							@click="logout"
						>
							Выйти из аккаунта
						</button>
						<Transition name="user-form">
							<UpdateUserForm
								v-if="isUpdating"
								@saved="closeUpdateForm"
								@cancel="closeUpdateForm"
							/>
						</Transition>
					</div>
					<div class="profile__user-posts">
						<div class="profile__user-scores">
							<span class="profile__posts-count"
								>Публикаций:&nbsp;
								<b class="profile__scores-markup">{{
									postsStore.posts.length
								}}</b></span
							>
							<span class="profile__likes-count"
								>Лайков:&nbsp;
								<b class="profile__scores-markup">{{
									userLikesNumber
								}}</b></span
							>
							<span class="profile__comments-count"
								>Комментариев:&nbsp;
								<b class="profile__scores-markup">{{
									userCommentsNumber
								}}</b></span
							>
						</div>
						<div class="profile__posts" v-if="postsStore.posts.length !== 0">
							<PostComponent
								v-for="post in postsStore.posts"
								:key="post.id"
								:post="post"
								:show-comments-immediately="true"
								:show-comments-on-command="true"
							/>
						</div>
					</div>
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
	</main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '~/stores/userStore'
import { usePostsStore } from '~/stores/postsStore'
import PostComponent from '~/app/components/static/PostComponent.vue'
import LoaderImg from '~/app/components/static/LoaderImg.vue'
import UpBtn from '~/app/components/static/UpBtn.vue'
import UpdateUserForm from '~/app/components/static/UpdateUserForm.vue'

const userStore = useUserStore()
const postsStore = usePostsStore()

const isUpdating = ref(false)
const loading = ref(false)

const { userActivity, isActivityLoading, activityError } =
	storeToRefs(userStore)

const userLikesNumber = computed(() => {
	return userActivity.value.likedPosts.length
})

const userCommentsNumber = computed(() => {
	return userActivity.value.comments.length
})

useHead({
	title: computed(() =>
		userStore.user
			? `${userStore.user.name} ${userStore.user.surName}`
			: 'Профиль пользователя',
	),
	meta: [
		{
			name: 'description',
			content: computed(() => `Profile page of ${userStore.user?.name}`),
		},
	],
})

definePageMeta({
	middleware: 'auth',
})

const logout = async () => {
	await userStore.logout()

	if (!userStore.isAuthenticated) {
		await navigateTo('/')
	}
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
	navigateTo('/')
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
			await Promise.all([
				postsStore.fetchUserPosts(userStore.user.id),
				userStore.fetchUserActivity(),
			])
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

.profile-page {
	min-height: 100vh;
}

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
		// margin-bottom: 1.12rem;

		@media (max-width: 48rem) {
			margin-bottom: unset;
		}
	}

	&__main-title {
		font-size: $px-30;
		line-height: 110%;
		letter-spacing: 0.02em;
		text-align: center;
		color: var(--text);

		@media (max-width: 48rem) {
			font-size: $px-22;
		}
	}

	&__wrapper {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem 1rem 1rem 1rem;
		border: 1px solid var(--border);
		border-radius: 0.5rem;
		width: 100%;

		position: relative;

		@media (max-width: 48rem) {
			flex-direction: column;
			align-items: center;
			border: unset;
		}
	}

	&__inner-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;

		@media (max-width: 48rem) {
			align-items: center;
		}
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
		color: var(--accent);

		b {
			color: var(--text);
		}

		@media (max-width: 48rem) {
			text-align: center;
			display: flex;
			flex-direction: column;
			gap: 0.2rem;
		}
	}

	&__info {
		display: flex;
		align-items: center;
		gap: 0.62rem;

		@media (max-width: 25rem) {
			flex-direction: column;
		}
	}

	&__info-inner {
		display: flex;
		// flex-direction: column;
		gap: 0.3rem;
	}

	&__user-photo {
		outline: 1px solid var(--border);
		border-radius: 50%;
		object-fit: cover;
		object-position: center;
		display: block;
	}

	&__picture-first {
		position: absolute;
		bottom: 2%;
		right: 0.5%;
		color: var(--text);
		width: 4rem;
		height: 4rem;
		transform: rotate(-45deg);

		@media (max-width: 48rem) {
			// display: none;
			right: 5%;
			bottom: none;
			top: 12%;
			transform: rotate(12deg);
			opacity: 0.6;
		}
	}

	&__picture-second {
		display: none;
		position: absolute;
		bottom: 15%;
		left: 4%;
		color: var(--text);

		width: 4rem;
		height: 4rem;

		@media (max-width: 48rem) {
			display: block;
			left: 5%;
			bottom: 15%;
			transform: rotate(-12deg);
			opacity: 0.6;
		}
	}

	&__update-account-btn {
		height: 2.18rem;
		margin-left: auto;
		margin-bottom: auto;

		&:hover,
		&:focus-visible {
			.profile__settings-icon {
				transform: rotate(30deg);
			}
		}

		@media (max-width: 48rem) {
			margin-left: unset;
			margin-bottom: unset;
		}
	}

	&__settings-icon {
		transition: transform $transition-300;
	}

	&__user-posts {
		display: flex;
		flex-direction: column;
		gap: 0.62rem;
	}

	&__user-scores {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.62rem;

		@media (max-width: 34.37rem) {
			grid-template-columns: 1fr;
			grid-template-rows: repeat(3, 1fr);
		}
	}

	&__scores-markup {
		font-size: $px-20;
		color: $apple;
	}

	&__posts-count,
	&__likes-count,
	&__comments-count {
		border-radius: 0.5rem;
		width: 100%;
		height: 3rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--border);
		text-align: start;
		color: var(--text);

		@media (max-width: 34.37rem) {
			height: 2rem;
		}
	}

	&__posts-count {
	}

	&__posts {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 0.62rem;
	}

	&__delete-profile-btn {
		margin-top: 2rem;
		width: 100%;
	}

	.user-form-enter-active {
		transition:
			opacity 0.3s ease-out,
			transform 0.3s ease-out;
	}

	.user-form-leave-active {
		transition:
			opacity 0.3s ease-in,
			transform 0.3s ease-in;
	}

	.user-form-enter-from,
	.user-form-leave-to {
		opacity: 0;
		transform: translateY(1.5rem);
	}

	.user-form-enter-to,
	.user-form-leave-from {
		opacity: 1;
		transform: translateY(0);
	}
}
</style>
