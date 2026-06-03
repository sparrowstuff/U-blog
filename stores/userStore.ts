import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { IUser } from '@/types/userType'

type PublicUser = {
	id: number
	name: string
	surName: string
	email: string
	createdAt: string
	isAdmin: boolean
	avatarUrl?: string
}

export const useUserStore = defineStore('user', () => {
	const user = ref<PublicUser | null>(null)
	const isReady = ref(false)
	const isAuthenticated = computed(() => !!user.value)

	const setUser = (payload: PublicUser) => {
		user.value = payload
	}

	const clearUser = () => {
		user.value = null
	}

	const fetchUser = async () => {
		isReady.value = true

		try {
			const res = await $fetch<PublicUser | null>('/api/auth/me')
			user.value = res
			// console.log(user.value)
		} finally {
			isReady.value = false
		}
	}

	const logout = async () => {
		await $fetch('/api/auth/logout', { method: 'POST' })

		clearUser()
	}

	// const deleteUser = async (userId: number) => {
	// 	await $fetch(`/api/users/${userId}`, { method: 'DELETE' })
	// 	clearUser()
	// }

	return {
		user,
		isAuthenticated,
		setUser,
		clearUser,
		fetchUser,
		logout,
		// deleteUser,
		isReady,
	}
})
