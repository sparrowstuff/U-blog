<template>
	<button
		class="theme-btn"
		:class="[
			{ 'theme-btn--light': themeStore.theme === 'light' },
			{ 'theme-btn--dark': themeStore.theme === 'dark' },
		]"
		type="button"
		aria-label="Переключение темы"
		@click="switchTheme"
	>
		<span
			class="theme-btn__light"
			:class="{ 'theme-btn__light--active': themeStore.theme === 'dark' }"
		>
			<svg
				class="theme-btn__light-icon"
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				fill="none"
				viewBox="0 0 24 24"
			>
				<path
					fill="#000"
					d="M12 17.75a5.75 5.75 0 0 1-3.19453-.969 5.7505 5.7505 0 0 1-2.11777-2.5806 5.74999 5.74999 0 0 1 7.5127-7.5127 5.7505 5.7505 0 0 1 2.5806 2.11777A5.75 5.75 0 0 1 17.75 12c-.0026 1.5242-.6093 2.9852-1.6871 4.0629C14.9852 17.1407 13.5242 17.7474 12 17.75m0-10a4.25 4.25 0 0 0-3.0052 7.2552 4.249 4.249 0 0 0 2.1761 1.1631c.8244.164 1.6789.0799 2.4555-.2418a4.2495 4.2495 0 0 0 1.9073-1.5653A4.25 4.25 0 0 0 16.25 12 4.26003 4.26003 0 0 0 12 7.75M12 5a.76.76 0 0 1-.5275-.22253A.76.76 0 0 1 11.25 4.25v-1.5c0-.19891.079-.38968.2197-.53033A.7499.7499 0 0 1 12 2c.1989 0 .3897.07902.5303.21967A.7498.7498 0 0 1 12.75 2.75v1.5a.76.76 0 0 1-.2225.52747A.76.76 0 0 1 12 5M12 22a.76.76 0 0 1-.5275-.2225.76.76 0 0 1-.2225-.5275v-1.5c0-.1989.079-.3897.2197-.5303A.7497.7497 0 0 1 12 19c.1989 0 .3897.079.5303.2197a.7497.7497 0 0 1 .2197.5303v1.5a.76.76 0 0 1-.2225.5275A.76.76 0 0 1 12 22M21.25 12.75h-1.5a.7497.7497 0 0 1-.5303-.2197A.7497.7497 0 0 1 19 12c0-.1989.079-.3897.2197-.5303a.7497.7497 0 0 1 .5303-.2197h1.5c.1989 0 .3897.079.5303.2197A.7497.7497 0 0 1 22 12c0 .1989-.079.3897-.2197.5303a.7497.7497 0 0 1-.5303.2197M4.25 12.75h-1.5a.7498.7498 0 0 1-.53033-.2197A.7499.7499 0 0 1 2 12c0-.1989.07902-.3897.21967-.5303A.7498.7498 0 0 1 2.75 11.25h1.5c.19891 0 .38968.079.53033.2197A.7499.7499 0 0 1 5 12a.7499.7499 0 0 1-.21967.5303.7498.7498 0 0 1-.53033.2197M6.50001 7.24995a.74.74 0 0 1-.5-.25l-1.09-1a.77078.77078 0 0 1 .545-1.31575.7708.7708 0 0 1 .545.22575l1 1.09a.75.75 0 0 1 0 1 .74.74 0 0 1-.5.25M18.56 19.31a.741.741 0 0 1-.2872-.0566.7395.7395 0 0 1-.2428-.1634L17 18a.7507.7507 0 0 1-.0624-.4501.75.75 0 0 1 .2089-.4035.75.75 0 0 1 .4035-.2088A.749.749 0 0 1 18 17l1.09 1a.7499.7499 0 0 1 0 1.06.742.742 0 0 1-.2392.1797.74.74 0 0 1-.2908.0703M17.5 7.24995a.7401.7401 0 0 1-.5-.25.74997.74997 0 0 1 0-1l1-1.09a.7707.7707 0 0 1 1.09 0 .771.771 0 0 1 .2258.545.771.771 0 0 1-.2258.545l-1.09 1a.7401.7401 0 0 1-.5.25M5.44001 19.31a.741.741 0 0 1-.28719-.0566.739.739 0 0 1-.24281-.1634.75.75 0 0 1-.21934-.53c0-.1988.07889-.3894.21934-.53l1.09-1.03a.749.749 0 0 1 .45005-.0624.75.75 0 0 1 .40351.2088.7503.7503 0 0 1 .20887.4035.7502.7502 0 0 1-.06243.4501l-1 1.09a.73983.73983 0 0 1-.56.22"
				/>
			</svg>
		</span>
		<span
			class="theme-btn__dark"
			:class="{ 'theme-btn__dark--active': themeStore.theme === 'light' }"
		>
			<svg
				class="theme-btn__dark-icon"
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="-5 0 32 32"
			>
				<path
					fill="#000"
					fill-rule="evenodd"
					d="M11.256 16C11.256 9.1 15.735 3.236 22 .991 20.243.361 18.353 0 16.372 0 7.33 0 0 7.164 0 16c0 8.837 7.33 16 16.372 16 1.981 0 3.871-.361 5.628-.991C15.735 28.764 11.256 22.901 11.256 16"
				/>
			</svg>
		</span>
	</button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useThemeStore } from '@/stores/themeStore'

const themeStore = useThemeStore()
// const isThemeDark = ref(false)

const switchTheme = () => {
	themeStore.toggleTheme()
	// isThemeDark.value = !isThemeDark.value
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/global/variables';

.theme-btn {
	background: transparent;
	width: fit-content;
	border: 1px solid var(--border);
	border-radius: 0.5rem;
	display: flex;
	align-items: center;
	gap: 0.2rem;
	$root: &;
	padding: 0.4rem 0.4rem 0.4rem 0.4rem;

	&__light,
	&__dark {
		display: flex;
		align-items: center;
	}

	&__light-icon,
	&__dark-icon {
		transition:
			opacity $transition-300,
			transform $transition-300;
	}

	&--light {
		#{$root}__light-icon {
			opacity: 1;
			transform: translateX(0);
		}

		#{$root}__dark-icon {
			opacity: 0;
			transform: translateX(-0.62rem);
		}
	}

	&--dark {
		// background: var(--light);

		#{$root}__light-icon {
			opacity: 0;
			transform: translateX(0.62rem);
		}

		#{$root}__dark-icon {
			opacity: 1;
			transform: translateX(0);
		}
	}
}
</style>
