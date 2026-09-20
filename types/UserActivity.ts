import type { PublicPost } from '~/types/PublicPost'
import type { CommentItem } from '~/types/CommentItem'

export type LikedPostItem = PublicPost & {
	likedAt: string
}

export type UserActivityComment = CommentItem & {
	post: {
		id: number
		title: string
		userId: number
	}
}

export type UserActivityResponse = {
	likedPosts: LikedPostItem[]
	comments: UserActivityComment[]
}
