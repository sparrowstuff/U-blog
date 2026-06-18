import type { ReactionType } from './Reaction'

export type PublicPost = {
	id: number
	title: string
	description: string
	userId: number
	createdAt: string
	updatedAt: string
	likesCount?: number
	dislikesCount?: number
	userReaction: ReactionType
	user: {
		id: number
		name: string
		surName: string
		email: string
		avatarUrl: string
	}
}
