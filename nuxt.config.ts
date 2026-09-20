// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },
	modules: ['@pinia/nuxt', '@tresjs/nuxt'],
	ssr: true,
	alias: {
		'~': fileURLToPath(new URL('.', import.meta.url)),
		'@': fileURLToPath(new URL('.', import.meta.url)),
	},
	css: ['~/assets/styles/main.scss'],

	// Runtime configuration for environment variables
	runtimeConfig: {
		databaseUrl: '',
		authCookieSecret: '',
	},

	vite: {
		optimizeDeps: {
			include: ['@vue/devtools-core', '@vue/devtools-kit'],
		},
	},
	app: {
		head: {
			link: [
				{
					rel: 'icon',
					type: 'image/svg+xml',
					href: '/favicon.svg',
				},
			],
		},
		pageTransition: { name: 'page', mode: 'out-in' },
	},
})
