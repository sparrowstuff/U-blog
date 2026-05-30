import { defineStore } from 'pinia'

export const useTestStore = defineStore('test', () => {
	const count = ref(0)

	const increment = () => {
		count.value++
	}

	const decrement = () => {
		count.value--
	}

	return {
		count,
		increment,
		decrement,
	}
})
