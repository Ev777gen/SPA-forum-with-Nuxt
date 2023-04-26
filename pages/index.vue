<template>
  <div class="homepage">
    <h1 class="homepage__title title">Single Page Application</h1>
    <h2 class="homepage__subtitle subtitle">Форум на Vue 3 и Firebase</h2>
    <div class="homepage__text">
      <p>
        Привет! Это пример реализации SPA в виде
        <NuxtLink to="/forum" class="homepage__link">форума</NuxtLink>. Здесь
        можно зарегистрироваться, создать новую тему, написать пост,
        отредактировать свои данные на странице профиля и поменять e-mail в
        настроках. Функционал и дизайн специально упрощены, чтобы было
        нагляднее.
      </p>
      <p>А еще приложение адаптировано под мобильные устройства.</p>
    </div>
    <div class="homepage__text">
      Для backend-части проекта я использовал Firebase 9:
      <ol class="homepage__list">
        <li>Cloud Firestore - в качестве базы данных;</li>
        <li>Authentication - для авторизации;</li>
        <li>
          Storage - для хранения аватарок, которые загружает пользователь.
        </li>
      </ol>
    </div>
    <div class="homepage__text">
      На GitHub можно посмотреть разные варианты исходного кода:
      <ol class="homepage__list">
        <li>
          <a href="https://github.com/Ev777gen/SPA" target="_blank"
            >Исходный код</a
          >
          (Vue.js 3 Optios API + Vuex);
        </li>
        <li>
          <a
            href="https://github.com/Ev777gen/SPA-forum-using-Pinia"
            target="_blank"
            >Исходный код</a
          >
          (Vue.js 3 Composition API + Pinia).
        </li>
      </ol>
    </div>
    <div class="homepage__text">
      Чтобы осмотреться вокруг, можно
      <NuxtLink to="/user/register" class="homepage__link">
        зарегистрироваться
      </NuxtLink>
      самостоятельно, используя любую почту и пароль, или
      <button
        class="btn btn_green"
        @click.prevent="logInWithDefaultUser"
        :disabled="authUser"
      >
        войти в аккаунт существующего пользователя
      </button>
    </div>
  </div>
</template>

<script setup>
const { authUser, signInUserWithEmailAndPassword } = useAuth();
const { fetchUser, startLoadingIndicator, stopLoadingIndicator } = useDatabase();

const nuxtApp = useNuxtApp();

async function logInWithDefaultUser() {
  try {
  startLoadingIndicator();
  const defaultUser = await fetchUser({ id: '8WGcARP4RqQchFNE2wh326iwQ913' });
  const credentials = await signInUserWithEmailAndPassword({
    email: defaultUser.email,
    password: "123456",
  });
  stopLoadingIndicator();
  } catch (error) {
   alert(error.message);
   stopLoadingIndicator();
  }
}
</script>

<style lang="scss" scoped>
.homepage {
  font-size: 16px;
  line-height: 1.5;

  &__title {
    margin: 30px 0;
  }

  &__subtitle {
    margin: 20px 0;
  }

  &__text {
    margin: 20px 0;
    text-align: justify;
    & p {
      margin: 20px 0;
    }
    & button {
      margin: 15px 0;
      text-align: center;
    }
  }

  &__list {
    & li {
      margin-left: 45px;
    }
  }
}
</style>
