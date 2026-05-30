<template>
	<article class="pagination">
		<button
			class="pagination__prev-page-btn btn btn--pagination"
			type="button"
			aria-label="На предыдущую страницу"
			@click="prevPage"
			:disabled="currentPage === 1"
		>
			<svg
				class="pagination__icon"
				width="25"
				height="25"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M11 9L8 12M8 12L11 15M8 12H16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
					stroke="currentColor"
					stroke-width="1"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</button>
		<div class="pagination__pages-block">
			<button
				class="pagination__current-page-btn btn btn--transparent"
				type="button"
				v-for="page in totalPages"
				:key="page"
				@click="goToPage(page)"
				:class="{ active: currentPage === page }"
			>
				{{ page }}
			</button>
		</div>
		<button
			class="pagination__next-page-btn btn btn--pagination"
			type="button"
			:disabled="currentPage === totalPages"
			@click="nextPage"
		>
			<svg
				class="pagination__icon"
				width="25"
				height="25"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M13 15L16 12M16 12L13 9M16 12H8M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
					stroke="currentColor"
					stroke-width="1"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</button>
	</article>
</template>

<script setup lang="ts">
const props = defineProps({
	totalPages: {
		type: Number,
		required: true,
		default: 1,
	},
	currentPage: {
		type: Number,
		required: true,
		default: 1,
	},
})

const emit = defineEmits(['update:current-page'])

const prevPage = () => {
	if (props.currentPage > 1) {
		goToPage(props.currentPage - 1)
	}
}

const nextPage = () => {
	if (props.currentPage < props.totalPages) {
		goToPage(props.currentPage + 1)
	}
}

const goToPage = (page: number) => {
	emit('update:current-page', page)
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/global/variables';

.pagination {
	width: 100%;
	display: flex;
	align-items: center;
	gap: 0.62rem;
	flex-wrap: wrap;
	justify-content: center;

	@media (max-width: 31.25rem) {
		gap: 0.36rem;
	}

	&__pages-block {
		display: flex;
		align-items: center;
		gap: 0.62rem;
	}

	&__prev-page-btn,
	&__current-page-btn,
	&__next-page-btn {
		border: 1px solid aqua;
		padding: 0.62rem 0.62rem 0.62rem 0.62rem;
		border-radius: 0.5rem;
		font-size: 0.98rem;
		transition:
			background-color 0.3s ease-in,
			scale 0.3s ease-in;
	}

	&__prev-page-btn:disabled,
	&__next-page-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	&__current-page-btn.active {
		background-color: darkseagreen;
	}

	.pagination button:hover {
		background-color: aquamarine;
		scale: 1.1;
	}
}
</style>
