<template>
	<article
		ref="tech-card-ref"
		class="tech-card"
		:class="{
			'tech-card--xxl': card.size === 'xxl',
			'tech-card--active': isHovered,
		}"
		:style="cardStyle"
		@pointerenter="onPointerEnter"
		@pointermove="onPointerMove"
		@pointerleave="onPointerLeave"
	>
		<div class="tech-card__canvas canvas-container">
			<TresCanvas alpha render-mode="on-demand">
				<TresPerspectiveCamera :position="[0, 5, 5]" />

				<TresMesh :rotation="meshRotation">
					<TresTorusGeometry :args="[1, 0.4, 12, 48]" />
					<TresMeshStandardMaterial color="#4f46e5" :roughness="0.3" />
				</TresMesh>

				<TresAmbientLight :intensity="1" />
				<TresDirectionalLight :position="[5, 5, 5]" :intensity="2" />
			</TresCanvas>
		</div>

		<div class="tech-card__shine" />

		<div class="tech-card__content">
			<a
				:href="props.card.href"
				target="_blank"
				rel="noopener noreferrer"
				class="tech-card__link"
			>
				<img
					:src="props.card.imageUrl"
					:alt="props.card.alt"
					class="tech-card__image"
					width="200"
					height="200"
				/>
				<span class="tech-card__link-text">{{ props.card.name }}</span>
			</a>
		</div>
	</article>
</template>

<script setup lang="ts">
import { useTemplateRef, ref, computed, onBeforeUnmount } from 'vue'
import { TresCanvas } from '@tresjs/core'
import type { TechnologyCard } from '~/app/data/technologies'

const props = defineProps<{
	card: TechnologyCard
}>()

const cardRef = useTemplateRef<HTMLElement>('tech-card-ref')

const rotateX = ref(0)
const rotateY = ref(0)
const pointerX = ref(50)
const pointerY = ref(50)

const isHovered = ref(false)

let animationFrameId: number | null = null

const cardStyle = computed(() => ({
	'--rotate-x': `${rotateX.value}deg`,
	'--rotate-y': `${rotateY.value}deg`,
	'--pointer-x': `${pointerX.value}%`,
	'--pointer-y': `${pointerY.value}%`,
}))

const meshRotation = computed<[number, number, number]>(() => {
	const degreesToRadians = Math.PI / 180

	return [
		rotateX.value * degreesToRadians * 0.7,
		rotateY.value * degreesToRadians * 0.7,
		0,
	]
})

const updateTilt = (clientX: number, clientY: number) => {
	const element = cardRef.value
	if (!element) return

	const rect = element.getBoundingClientRect()

	const x = (clientX - rect.left) / rect.width
	const y = (clientY - rect.top) / rect.height

	const strength = props.card.size === 'xxl' ? 8 : 11

	rotateX.value = (0.5 - y) * strength
	rotateY.value = (x - 0.5) * strength

	pointerX.value = x * 100
	pointerY.value = y * 100
}

const onPointerEnter = () => {
	isHovered.value = true
}

const onPointerMove = (event: PointerEvent) => {
	if (event.pointerType === 'touch') return

	const { clientX, clientY } = event

	if (animationFrameId !== null) {
		cancelAnimationFrame(animationFrameId)
	}

	animationFrameId = requestAnimationFrame(() => {
		updateTilt(clientX, clientY)
		animationFrameId = null
	})
}

const onPointerLeave = () => {
	isHovered.value = false

	rotateX.value = 0
	rotateY.value = 0
	pointerX.value = 50
	pointerY.value = 50
}

onBeforeUnmount(() => {
	if (animationFrameId !== null) {
		cancelAnimationFrame(animationFrameId)
	}
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/global/variables';

.tech-card {
	--rotate-x: 0deg;
	--rotate-y: 0deg;
	--pointer-x: 50%;
	--pointer-y: 50%;

	height: 7rem;
	position: relative;
	overflow: hidden;
	border-radius: 0.5rem;
	border: 1px solid var(--border);

	transform: perspective(700px) rotateX(var(--rotate-x))
		rotateY(var(--rotate-y)) translateZ(0);

	transform-style: preserve-3d;
	will-change: transform;

	transition:
		transform $transition-300,
		box-shadow $transition-300,
		border-color $transition-300;

	&:hover .tech-card__link-text,
	&:focus-visible .tech-card__link-text,
	&:focus-within .tech-card__link-text {
		opacity: 1;
		transform: translateY(0);
	}

	&--active {
		box-shadow:
			0 18px 32px rgb(0 0 0 / 20%),
			0 0 20px rgb(79 70 229 / 18%);

		transform: perspective(700px) rotateX(var(--rotate-x))
			rotateY(var(--rotate-y)) translateZ(0.2rem) scale(1.02);

		transition:
			transform 50ms linear,
			box-shadow 180ms ease-out,
			border-color 180ms ease-out;
	}

	&--xxl {
		grid-column: span 2;

		@media (max-width: 31.25rem) {
			grid-column: unset;
		}
	}

	&__canvas {
		position: absolute;
		inset: 0;
		z-index: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;

		transform: translateZ(8px);
	}

	&__shine {
		position: absolute;
		inset: 0;
		z-index: 1;
		pointer-events: none;
		opacity: 0;

		background: radial-gradient(
			circle at var(--pointer-x) var(--pointer-y),
			rgb(255 255 255 / 24%),
			transparent 45%
		);

		transition: opacity 180ms ease-out;
	}

	&--active &__shine {
		opacity: 1;
	}

	&__content {
		height: 100%;
		transform-style: preserve-3d;
		will-change: transform;
		position: relative;
		inset: 0;
		z-index: 0;
		// pointer-events: none;
	}

	&__link {
		width: 100%;
		height: 100%;
		z-index: 5;
	}

	&__link-text {
		position: absolute;
		bottom: 4%;
		right: 2%;
		display: block;
		width: fit-content;
		background-color: $white-grey;
		color: $purple-deep;
		border-radius: 0.25rem;
		padding: 0.2rem 0.2rem 0.2rem 0.2rem;
		font-size: $px-22;
		line-height: 110%;
		opacity: 0;
		transform: translateY(1rem);

		@media (max-width: 31.25rem) {
			opacity: 1;
			transform: translateY(0);
		}

		transition:
			color $transition-300,
			opacity $transition-300,
			transform $transition-300;
	}

	&__image {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
		object-position: center;
		transition: scale $transition-300;
	}

	@media (prefers-reduced-motion: reduce) {
		.tech-card {
			transform: none;
			transition: none;

			&--active {
				transform: none;
			}

			&__canvas {
				display: none;
			}
		}
	}
}

.canvas-container {
	width: 100%;
	height: 100%;
	position: absolute;
	inset: 0;
	z-index: 0;
	pointer-events: none;
}
</style>
