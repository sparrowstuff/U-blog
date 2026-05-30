import { defineStore } from 'pinia'
import { ref } from 'vue'

type PublicPost = {
	id: number
	title: string
	description: string
	userId: number
	createdAt: string
	updatedAt: string
	user: {
		id: number
		name: string
		surName: string
		email: string
	}
}

export const usePostsStore = defineStore('posts', () => {
	const posts = ref<PublicPost[]>([])
	const currentPost = ref<PublicPost | null>(null)
	const isLoading = ref(false)
	const customError = ref<string | null>(null)

	const setPosts = (payload: PublicPost[]) => {
		posts.value = payload
	}

	const setCurrentPost = (payload: PublicPost | null) => {
		currentPost.value = payload
	}

	const clearCurrentPost = () => {
		currentPost.value = null
	}

	const fetchPosts = async () => {
		isLoading.value = true
		customError.value = null

		try {
			const res = await $fetch<PublicPost[]>('/api/posts')
			posts.value = res
		} catch (err: any) {
			customError.value = err?.data?.statusMessage || 'Ошибка загрузки постов'
		} finally {
			isLoading.value = false
		}
	}

	const fetchPostById = async (postId: number) => {
		isLoading.value = true
		customError.value = null

		try {
			const res = await $fetch<PublicPost>(`/api/posts/${postId}`)
			currentPost.value = res
		} catch (err: any) {
			customError.value = err?.data?.statusMessage || 'Ошибка загрузки поста'
			currentPost.value = null
		} finally {
			isLoading.value = false
		}
	}

	const addPost = async (payload: {
		title: string
		description: string
		userId: number
	}) => {
		isLoading.value = true
		customError.value = null

		try {
			const res = await $fetch<PublicPost>('/api/posts', {
				method: 'POST',
				body: payload,
			})

			posts.value.unshift(res)

			await fetchPosts()

			return res
		} catch (e: any) {
			customError.value = e?.data?.statusMessage || 'Ошибка создания поста'
			throw e
		} finally {
			isLoading.value = false
		}
	}

	const fetchUserPosts = async (userId: number) => {
		isLoading.value = true
		customError.value = null

		try {
			const res = await $fetch<PublicPost[]>(`/api/users/${userId}/posts`)
			posts.value = res
			// console.log(res)
		} catch (err: any) {
			customError.value = err?.data?.statusMessage || 'Ошибка загрузки постов'
		} finally {
			isLoading.value = false
		}
	}

	const deletePost = async (postId: number, userId: number) => {
		isLoading.value = true
		customError.value = null

		try {
			const confirmed = confirm('Удалить данный пост?')
			if (!confirmed) return

			await $fetch(`/api/posts/${postId}`, {
				method: 'DELETE',
				body: { userId },
			})

			posts.value = posts.value.filter(post => post.id !== postId)

			if (currentPost.value?.id === postId) {
				currentPost.value = null
			}
		} catch (err: any) {
			alert('У вас нет доступа к удалению постов написанных не вами!!!')
			throw err
		} finally {
			isLoading.value = false
		}
	}

	return {
		posts,
		currentPost,
		isLoading,
		customError,
		setPosts,
		setCurrentPost,
		clearCurrentPost,
		fetchPosts,
		fetchPostById,
		addPost,
		fetchUserPosts,
		deletePost,
	}
})
