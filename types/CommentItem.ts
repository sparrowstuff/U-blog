export type CommentItem = {
	id: number
	content: string
	createdAt: string
	updatedAt: string
	postId: number
	userId: number
	user: CommentUser
}
