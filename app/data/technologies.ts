export type TechnologyCard = {
	id: number
	name: string
	imageUrl: string
	href: string
	alt: string
	size: 'normal' | 'xxl'
}

const technologies = [
	{
		id: 1,
		name: 'Nuxt.js',
		imageUrl: '/images/tech/Nuxt-js-logo.png',
		href: 'https://nuxt.com/',
		alt: 'Nuxt.js Logo',
		size: 'xxl',
	},
	{
		id: 2,
		name: 'Vue.js',
		imageUrl: '/images/tech/vue-logo.svg',
		href: 'https://vuejs.org/',
		alt: 'Vue.js Logo',
		size: 'xxl',
	},

	{
		id: 3,
		name: 'Pinia',
		imageUrl: '/images/tech/Pinia-logo.svg',
		href: 'https://pinia.vuejs.org/',
		alt: 'Pinia-logo',
		size: 'xxl',
	},
	{
		id: 4,
		name: 'Node.js',
		imageUrl: '/images/tech/Node.js-logo.webp',
		href: 'https://nodejs.org/en',
		alt: 'Node.js Logo',
		size: 'normal',
	},
	{
		id: 5,
		name: 'Vue-router',
		imageUrl: '/images/tech/vue-logo.svg',
		href: 'https://router.vuejs.org/',
		alt: 'Vue-router Logo',
		size: 'normal',
	},
	{
		id: 6,
		name: 'VueUse',
		imageUrl: '/images/tech/vue-use-logo.svg',
		href: 'https://vueuse.org/',
		alt: 'VueUse Logo',
		size: 'normal',
	},
	{
		id: 7,
		name: 'Sass',
		imageUrl: '/images/tech/sass-logo.svg',
		href: 'https://sass-lang.com/',
		alt: 'Sass Logo',
		size: 'normal',
	},
	{
		id: 8,
		name: 'PostgreSQL',
		imageUrl: '/images/tech/pg-admin-logo.png',
		href: 'https://www.postgresql.org/',
		alt: 'PostgreSQL Logo',
		size: 'xxl',
	},
	{
		id: 9,
		name: 'Prisma',
		imageUrl: '/images/tech/prisma-logo.png',
		href: 'https://www.prisma.io/',
		alt: 'Prisma Logo',
		size: 'normal',
	},
	{
		id: 10,
		name: 'PgAdmin',
		imageUrl: '/images/tech/pg-admin-logo.png',
		href: 'https://www.pgadmin.org/',
		alt: 'PgAdmin Logo',
		size: 'normal',
	},
	{
		id: 11,
		name: 'Bcrypt',
		imageUrl: '/images/tech/bcrypt-logo.png',
		href: 'https://www.npmjs.com/package/bcrypt',
		alt: 'Bcrypt Logo',
		size: 'normal',
	},
	{
		id: 12,
		name: 'Zod',
		imageUrl: '/images/tech/zod-logo.webp',
		href: 'https://www.npmjs.com/package/zod',
		alt: 'Zod Logo',
		size: 'normal',
	},
] satisfies TechnologyCard[]

export default technologies
