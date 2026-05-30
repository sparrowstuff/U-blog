import { IPost } form '../types/PostType'

export type IUser = {
	id: number
	name: string
	surName: string
	email: string
	password: string
	createdAt: string
	isAdmin: boolean
}

export type IUserPublic = Omit<IUser, 'password'> & {
  posts: IPost[]
}