import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PublicUser } from '@/types/PublicUser'
import type { UpdateUserPayload } from '@/types/UpdateUserType'
import type { UserActivityResponse } from '@/types/UserActivity'

export const useUserStore = defineStore('user', () => {
	const user = ref<PublicUser | null>(null)
	const userActivity = ref<UserActivityResponse>({
		likedPosts: [],
		comments: [],
	})

	const isReady = ref(false)
	const isAuthenticated = computed(() => !!user.value)
	const isActivityLoading = ref(false)
	const activityError = ref<string | null>(null)

	const clearUserActivity = () => {
		userActivity.value = {
			likedPosts: [],
			comments: [],
		}

		activityError.value = null
		isActivityLoading.value = false
	}

	const setUser = (payload: PublicUser) => {
		user.value = payload
	}

	const clearUser = () => {
		user.value = null
		clearUserActivity()
	}

	const fetchUser = async () => {
		isReady.value = true

		try {
			const res = await $fetch<PublicUser | null>('/api/auth/me')
			user.value = res
		} finally {
			isReady.value = false
		}
	}

	const fetchUserActivity = async () => {
		if (!user.value) {
			throw new Error('User is not authenticated')
		}

		isActivityLoading.value = true
		activityError.value = null

		try {
			const result = await $fetch<UserActivityResponse>(
				`/api/users/${user.value.id}/activity`,
			)

			userActivity.value = result

			return result
		} catch (error: any) {
			activityError.value =
				error?.data?.statusMessage ||
				error?.statusMessage ||
				'Не удалось загрузить активность пользователя'

			throw error
		} finally {
			isActivityLoading.value = false
		}
	}

	const logout = async () => {
		const userConfirmation = confirm('Выйти из аккаунта?')

		if (!userConfirmation) return
		else {
			await $fetch('/api/auth/logout', { method: 'POST' })
			clearUser()
		}
	}

	const deleteUser = async (userId: number) => {
		await $fetch(`/api/users/${userId}`, { method: 'DELETE' })
		clearUser()
	}

	const updateUser = async (userId: number, payload: UpdateUserPayload) => {
		const updatedUser = await $fetch<PublicUser>(
			`/api/users/${userId}/update`,
			{
				method: 'PATCH',
				body: payload,
			},
		)

		user.value = updatedUser
		return updatedUser
	}

	const uploadAvatar = async (file: File): Promise<string> => {
		if (!user.value) {
			throw new Error('User is not authenticated')
		}

		const formData = new FormData()
		formData.append('file', file)

		const result = await $fetch<{
			avatarUrl: string
		}>(`/api/users/${user.value.id}/avatar`, {
			method: 'POST',
			body: formData,
		})

		user.value.avatarUrl = result.avatarUrl

		return result.avatarUrl
	}

	return {
		user,
		isAuthenticated,
		userActivity,
		isActivityLoading,
		activityError,
		setUser,
		clearUser,
		fetchUser,
		fetchUserActivity,
		logout,
		isReady,
		deleteUser,
		updateUser,
		uploadAvatar,
	}
})
