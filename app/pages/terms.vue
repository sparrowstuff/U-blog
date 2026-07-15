<template>
	<section class="terms">
		<div class="container">
			<div class="terms__btn-block">
				<button
					class="terms__back-btn btn btn--transparent"
					aria-label="Вернуться на главную страницу"
					@click="() => navigateTo('/')"
				>
					На главную страницу
				</button>
				<button
					class="terms__terms-btn btn btn--transparent"
					aria-label="На страницу правил сайта"
					@click="() => navigateTo('/privacy')"
				>
					На страницу правил приватности
				</button>
			</div>
			<div class="terms__wrapper">
				<p class="terms__title">
					Этот сайт предназначен для ознакомления с проектом, его возможностями
					и контактной информацией автора.
				</p>
				<p class="terms__text">
					Используя сайт, пользователь подтверждает, что ознакомился с
					настоящими Правилами и принимает их условия.
				</p>
				<p class="terms__text">Пользователь обязуется:</p>
				<ul class="terms-list">
					<li class="terms-list__item">
						не предпринимать действий, нарушающих работу сайта;
					</li>
					<li class="terms-list__item">
						не пытаться получить несанкционированный доступ к его части, данным
						или серверной инфраструктуре;
					</li>
					<li class="terms-list__item">
						не использовать сайт для распространения вредоносного кода, спама
						или незаконного контента(порнография, экстремистские материалы);
					</li>
					<li class="terms-list__item">
						соблюдать действующее законодательство при использовании любых
						функций сайта.
					</li>
				</ul>
				<p class="terms__text">
					Вся информация, размещённая на сайте, предназначена для
					ознакомительных целей.
				</p>
				<p class="terms__text">
					Администрация сайта не гарантирует абсолютную непрерывность работы
					сервиса и вправе изменять его содержание, структуру и функциональность
					без предварительного уведомления.
				</p>
				<p class="terms__text">
					Администрация сайта вправе ограничить доступ пользователю, если его
					действия нарушают настоящие Правила или мешают корректной работе
					сайта.
				</p>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
@import '@/assets/styles/global/variables';

.terms {
	&__btn-block {
		margin-bottom: 1rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;

		@media (max-width: 48rem) {
			margin-bottom: 0.5rem;
			flex-direction: column;
			align-items: flex-start;
		}
	}

	&__wrapper {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	&__title {
		font-size: $px-24;
		line-height: 110%;
		color: $apple;

		@media (max-width: 48rem) {
			font-size: $px-16;
		}
	}

	&__text {
		font-size: $px-20;
		line-height: 110%;

		@media (max-width: 48rem) {
			font-size: $px-12;
		}
	}
}

.terms-list {
	list-style-type: disc;
	padding-left: 1.2rem;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;

	&__item {
		color: $red;
		text-transform: uppercase;
		font-size: $px-16;
		font-weight: 400;

		@media (max-width: 48rem) {
			font-size: $px-12;
		}
	}
}
</style>
