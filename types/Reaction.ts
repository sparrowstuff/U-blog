export type ReactionType = 'like' | 'dislike' | null

export type ReactionResponse = {
	success: Boolean
	likesCount: number
	dislikesCount: number
	userReaction: ReactionType
}
