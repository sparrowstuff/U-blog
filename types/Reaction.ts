type ReactionType = 'like' | 'dislike' | null

type ReactionResponse = {
	success: Boolean
	likesCount: number
	dislikesCount: number
	userReaction: ReactionType
}

export { ReactionType, ReactionResponse }
