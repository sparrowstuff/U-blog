<template>
	<section class="privacy">
		<div class="container">
			<div class="privacy__btn-block">
				<button
					class="privacy__back-btn btn btn--transparent"
					aria-label="Вернуться на главную страницу"
					@click="() => navigateTo('/')"
				>
					На главную страницу
				</button>
				<button
					class="privacy__terms-btn btn btn--transparent"
					aria-label="На страницу правил сайта"
					@click="() => navigateTo('/terms')"
				>
					На страницу правил пользования сайтом
				</button>
			</div>
			<div class="privacy__wrapper">
				<p class="privacy__title">
					Настоящая Политика обработки персональных данных действует в отношении
					информации, которую сайт может получить о пользователе при его
					использовании, а также при заполнении форм обратной связи, авторизации
					и взаимодействии с функциональностью сайта. Используя сайт,
					пользователь подтверждает, что ознакомился с настоящей
					<NuxtLink :to="'/terms'">Политикой</NuxtLink> и согласен с её
					условиями.
				</p>
				<ol class="privacy-list">
					<li class="privacy-list__item">
						<p class="privacy-list__info">Общие положения</p>
						<span class="privacy-list__text">
							Администрация сайта уважает право пользователя на
							неприкосновенность частной жизни и обеспечивает защиту
							персональных данных в соответствии с действующим
							законодательством. Политика определяет порядок сбора, хранения,
							использования и защиты персональных данных пользователей сайта.
						</span>
					</li>
					<li class="privacy-list__item">
						<p class="privacy-list__info">Какие данные могут обрабатываться</p>
						<span class="privacy-list__text"
							>Сайт может обрабатывать следующие данные пользователя:</span
						>
						<ul class="privacy-list__inner-list">
							<li class="privacy-list__inner-list-item">имя и фамилия;</li>
							<li class="privacy-list__inner-list-item">
								адрес электронной почты;
							</li>
							<li class="privacy-list__inner-list-item">
								содержимое сообщений, отправленных через формы сайта;
							</li>
							<li class="privacy-list__inner-list-item">
								технические данные, автоматически передаваемые браузером;
							</li>
							<li class="privacy-list__inner-list-item">
								cookies и иные данные, используемые для корректной работы сайта
								и хранения настроек пользователя.
							</li>
						</ul>
					</li>
					<li class="privacy-list__item">
						<p class="privacy-list__info">Цели обработки данных</p>
						<span class="privacy-list__text"
							>Персональные данные обрабатываются для:</span
						>
						<ul class="privacy-list__inner-list">
							<li class="privacy-list__inner-list-item">
								предоставления доступа к функциям сайта;
							</li>
							<li class="privacy-list__inner-list-item">
								авторизации и идентификации пользователя;
							</li>
							<li class="privacy-list__inner-list-item">
								связи с пользователем по его запросу;
							</li>
							<li class="privacy-list__inner-list-item">
								улучшения работы сайта и удобства его использования;
							</li>
							<li class="privacy-list__inner-list-item">
								сохранения пользовательских настроек, включая выбор согласия на
								использование cookies.
							</li>
						</ul>
					</li>
					<li class="privacy-list__item">
						<p class="privacy-list__info">Cookies</p>
						<span class="privacy-list__text"
							>Сайт использует cookies только в объёме, необходимом для его
							работы и, при наличии согласия пользователя, для сохранения
							пользовательских предпочтений. Пользователь может отказаться от
							необязательных cookies через баннер, однако это не влияет на
							работу обязательных технических функций сайта.</span
						>
					</li>
					<li class="privacy-list__item">
						<p class="privacy-list__info">Передача данных третьим лицам</p>
						<span class="privacy-list__text"
							>Персональные данные не передаются третьим лицам, за исключением
							случаев, предусмотренных законом, либо если это необходимо для
							работы сайта и его инфраструктуры. Если в будущем будут подключены
							сторонние сервисы, это будет отражено в настоящей Политике.</span
						>
					</li>
					<li class="privacy-list__item">
						<p class="privacy-list__info">Хранение и защита данных</p>
						<span class="privacy-list__text"
							>Администрация сайта принимает необходимые организационные и
							технические меры для защиты персональных данных от неправомерного
							доступа, изменения, раскрытия или уничтожения. Данные хранятся не
							дольше, чем это необходимо для достижения целей их
							обработки.</span
						>
					</li>
					<li class="privacy-list__item">
						<p class="privacy-list__info">Права пользователя</p>
						<span class="privacy-list__text">Пользователь имеет право:</span>
						<ul class="privacy-list__inner-list">
							<li class="privacy-list__inner-list-item">
								получать сведения об обработке своих персональных данных;
							</li>
							<li class="privacy-list__inner-list-item">
								требовать уточнения, блокировки или уничтожения своих данных,
								если они являются неполными, устаревшими или незаконно
								полученными;
							</li>
							<li class="privacy-list__inner-list-item">
								отзывать согласие на обработку персональных данных, если оно
								было ранее дано;
							</li>
							<li class="privacy-list__inner-list-item">
								обращаться к администрации сайта по вопросам обработки
								персональных данных.
							</li>
						</ul>
					</li>
					<li class="privacy-list__item">
						<p class="privacy-list__info">Обратная связь</p>
						<span class="privacy-list__text"
							>По вопросам, связанным с обработкой персональных данных,
							пользователь может обратиться через контакты, указанные на
							сайте.</span
						>
					</li>
					<li class="privacy-list__item">
						<p class="privacy-list__info">Изменение политики</p>
						<span class="privacy-list__text"
							>Администрация сайта вправе изменять настоящую Политику.
							Актуальная версия всегда доступна на этой странице.</span
						>
					</li>
				</ol>
			</div>
		</div>
	</section>

	<UpBtn />
</template>

<script setup lang="ts">
import UpBtn from '../components/static/UpBtn.vue'
</script>

<style scoped lang="scss">
@import '@/assets/styles/global/variables';

.privacy {
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
			font-size: $px-20;
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

.privacy-list {
	padding-left: 1.2rem;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;

	$root: &;

	&__item {
		font-size: $px-16;
		font-weight: 400;

		@media (max-width: 48rem) {
			font-size: $px-12;
		}
	}

	&__info {
		margin-bottom: 0.5rem;
		font-weight: 600;
		font-size: $px-20;

		@media (max-width: 48rem) {
			font-size: $px-16;
		}
	}

	&__text {
		margin-bottom: 0.5rem;

		font-size: $px-16;

		@media (max-width: 48rem) {
			font-size: $px-12;
		}
	}

	&__inner-list {
		list-style-type: disc;
		padding-left: 1rem;
		margin-left: 0.2rem;
		margin-top: 0.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	&__inner-list-item {
		color: rgba(255, 42, 42, 0.84);
		text-transform: uppercase;
		font-size: $px-16;
		font-weight: 400;

		@media (max-width: 48rem) {
			font-size: $px-12;
		}
	}
}
</style>
