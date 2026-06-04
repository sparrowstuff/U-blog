<template>
	<section class="post-page">
		<div class="container">
			<LoaderImg v-if="loading" />
			<div class="post-page__wrapper" v-else-if="postsStore.currentPost">
				<h2 class="post-page__title">
					Пост номер {{ postsStore.currentPost?.id }}
				</h2>
				<PostComponent
					class="post-page__post"
					:post="postsStore.currentPost"
					:show-comments-immediately="true"
				/>
			</div>
			<span class="post-page__no-post" v-else>Пост не найден</span>
		</div>
	</section>
</template>

<script setup lang="ts">
import PostComponent from '~/app/components/static/PostComponent.vue'
import LoaderImg from '~/app/components/static/LoaderImg.vue'
import { usePostsStore } from '~/stores/postsStore'
import { useCommentsStore } from '~/stores/commentsStore'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const postsStore = usePostsStore()
const commentsStore = useCommentsStore()

const route = useRoute()

const loading = ref(false)

onMounted(async () => {
	loading.value = true

	try {
		const id = Number(route.params.id)

		if (Number.isNaN(id) || id <= 0) return

		if (!id) {
			return
		} else {
			await postsStore.fetchPostById(id)

			await commentsStore.fetchCommentsByPostId(id)
		}
	} catch (err) {
		console.error(err)
	} finally {
		loading.value = false
	}
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/global/variables.scss';

.post-page {
	&__wrapper {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
}
</style>
