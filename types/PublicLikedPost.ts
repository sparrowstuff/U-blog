import type { ReactionType } from '@/types/Reaction'

export type PublicLikedPost = {
	id: number
	title: string
	description: string
	userId: number
	createdAt: Date
	updatedAt: Date
	likesCount: number
	dislikesCount: number
	userReaction: ReactionType
	user: {
		id: number
		name: string
		surName: string
		email: string
		avatarUrl: string | null
	}
}
