<template>
	<Transition name="loading" mode="out-in">
		<div class="loader">
			<img
				src="@/assets/loading.gif"
				alt="loading"
				class="loader__img"
				width="200"
				height="200"
			/>
		</div>
	</Transition>
</template>

<style scoped lang="scss">
@import '@/assets/styles/global/variables.scss';
</style>
