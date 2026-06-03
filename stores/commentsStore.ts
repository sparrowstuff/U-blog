import { defineStore } from 'pinia'
import { ref } from 'vue'

type CommentUser = {
	id: number
	name: string
	surName: string
	email: string
	avatarUrl: string | null
}

type CommentItem = {
	id: number
	content: string
	createdAt: string
	updatedAt: string
	postId: number
	userId: number
	user: CommentUser
}

export const useCommentsStore = defineStore('commentsStore', () => {
	const commentsByPostId = ref<Record<number, CommentItem[]>>({})
	const isLoading = ref(false)
	const customError = ref<string | null>(null)

	const getCommentsByPostId = (postId: number): CommentItem[] => {
		return commentsByPostId.value[postId] ?? []
	}

	const fetchCommentsByPostId = async (postId: number) => {
		isLoading.value = true
		customError.value = null

		try {
			const res = await $fetch<CommentItem[]>(`/api/posts/${postId}/comments`)
			commentsByPostId.value[postId] = res
		} catch (err: any) {
			customError.value =
				err?.data?.statusMessage || 'Ошибка загрузки комментариев'
			commentsByPostId.value[postId] = []
		} finally {
			isLoading.value = false
		}
	}

	const addComment = async (
		postId: number,
		payload: { content: string; userId: number },
	) => {
		isLoading.value = true
		customError.value = null

		try {
			const res = await $fetch<CommentItem>(`/api/posts/${postId}/comments`, {
				method: 'POST',
				body: payload,
			})

			if (!commentsByPostId.value[postId]) {
				commentsByPostId.value[postId] = []
			}

			commentsByPostId.value[postId].push(res)
			return res
		} catch (err: any) {
			customError.value =
				err?.data?.statusMessage || 'Ошибка добавления комментария'
			throw err
		} finally {
			isLoading.value = false
		}
	}

	const clearComments = (postId?: number) => {
		if (postId) {
			delete commentsByPostId.value[postId]
		} else {
			commentsByPostId.value = {}
		}
		customError.value = null
	}

	const deleteComment = async (postId: number, commentId: number) => {
		isLoading.value = true
		customError.value = null

		try {
			await $fetch(`/api/posts/${postId}/comments`, {
				method: 'DELETE',
				body: { commentId },
			})

			commentsByPostId.value[postId] = (
				commentsByPostId.value[postId] ?? []
			).filter(comment => comment.id !== commentId)
		} catch (err: any) {
			customError.value =
				err?.data?.statusMessage || 'Ошибка удаления комментария'
			throw err
		} finally {
			isLoading.value = false
		}
	}

	return {
		isLoading,
		customError,
		fetchCommentsByPostId,
		getCommentsByPostId,
		addComment,
		clearComments,
		deleteComment,
	}
})
