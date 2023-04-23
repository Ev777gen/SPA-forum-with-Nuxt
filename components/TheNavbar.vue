<template>
  <header class="header">
    <div class="header__body container">
      <NuxtLink
        to="/"
        v-if="!isMobile || (authUser && isMobile)"
        class="header__logo"
        >Logo</NuxtLink
      >

      <a href="#" @click.prevent="onSignOut">Выйти</a>

      <!--<div class="header__menu">

        <label class="switch">
          <input type="checkbox" v-model="isDarkMode" @click="toggleDarkMode" />
          <span class="slider round"></span>
        </label>

        <a
          v-if="authUser && !isMobile"
          @click.prevent="isDropdownOpen = !isDropdownOpen"
          v-click-outside="onClickOutside"
          class="header__user-avatar"
        >
          <AppAvatar class="header__avatar avatar_small" :src="authUser?.avatar" :alt="`${authUser.name} profile image`"/>
          <font-awesome-icon icon="fa-solid fa-angle-down" class="header__arrow" :class="{'header__arrow_up': isDropdownOpen}" />
        </a>
        
        <div 
          v-else-if="authUser && isMobile" 
          @click="isDropdownOpen = !isDropdownOpen"
          v-click-outside="onClickOutside"
          class="burger"
        >
          <div class="burger__top-bar"></div>
          <div class="burger__middle-bar"></div>
          <div class="burger__bottom-bar"></div>
        </div>

        <div v-else class="header__not-auth-user">
          <nuxt-link :to="{name: 'RegisterForm'}" class="header__link">Зарегистрироваться</nuxt-link>
          <nuxt-link :to="{name: 'SignIn'}" class="header__link">
            <font-awesome-icon icon="fa-solid fa-right-to-bracket" /> Войти
          </nuxt-link>
        </div>

        <div class="dropdown" :class="{'dropdown_open': isDropdownOpen}" :style="isDarkMode ? { backgroundColor: '#eee' } : null">
          <nav class="dropdown__nav mobile-only">
            <nuxt-link :to="{name: 'HomeView'}" class="dropdown__link">На главную</nuxt-link>
            <nuxt-link :to="{name: 'ForumMainPage'}" class="dropdown__link">Форум</nuxt-link>
            <nuxt-link :to="{name: 'AboutMe'}" class="dropdown__link">Обо мне</nuxt-link>
            <hr :style="isDarkMode ? { backgroundColor: '#ddd' } : null">
          </nav>
          <nuxt-link :to="{name: 'ProfileView'}" class="dropdown__link">Мой профиль</nuxt-link>
          <nuxt-link :to="{name: 'SettingsView'}" class="dropdown__link">Настройки</nuxt-link>
          <a href="" class="dropdown__link" @click.prevent="onSignOut">Выйти <font-awesome-icon icon="fa-solid fa-right-from-bracket" /></a>
        </div>

      </div>-->
    </div>
  </header>
</template>

<script setup>
//import clickOutside from 'click-outside-vue3';
//import useDarkMode from '@/composables/useDarkMode';

//const vClickOutside = clickOutside.directive;

const router = useRouter();

//const { isDarkMode, toggleDarkMode } = useDarkMode();

const isDropdownOpen = ref(false);
const isMobile = ref(false);

const { authUser, signOutUser } = useAuth();

onCreated();

async function onCreated() {
  router.beforeEach(() => {
    isDropdownOpen.value = false;
  });
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    isMobile.value = true;
  } else {
    isMobile.value = false;
  }
}

function onSignOut() {
  signOutUser();
  isDropdownOpen.value = false;
}

function onClickOutside() {
  isDropdownOpen.value = false;
}
</script>

<style lang="scss" scoped>
$burger-size: 35px;
$dropdown-color: #fff;
$dropdown-link-color: #444;
$triangle-size: 8px;

.header {
  padding: 20px 0;
  background-color: #23374d;

  &__body {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 35px;
  }

  &__logo {
    font-size: 32px;
    font-weight: bold;
    color: #fff;
  }

  &__menu {
    display: flex;
    align-items: center;
  }

  &__not-auth-user {
    margin-left: auto;
  }

  &__user-avatar {
    cursor: pointer;
  }

  &__arrow {
    margin-left: 5px;
    margin-top: 10px;
    vertical-align: middle;
    color: #fff;
    transition: all 0.3s;
  }

  &__arrow_up {
    transform: rotate(-180deg);
  }

  &__link {
    margin-left: 15px;
    font-size: 16px;
    font-weight: 700;
    color: #ffb579;
    &:last-child {
      color: #fff;
    }
  }
}

.burger {
  width: $burger-size;
  height: $burger-size;
  margin: 0 10px;
  cursor: pointer;

  &__top-bar,
  &__middle-bar,
  &__bottom-bar {
    width: $burger-size;
    height: 3px;
    background: white;
    position: absolute;
    border-radius: 10px;
    transition: all 0.5s;
  }

  &__top-bar {
    top: 15%;
  }

  &__middle-bar {
    top: 50%;
  }

  &__bottom-bar {
    top: 85%;
  }
}

.dropdown {
  position: absolute;
  display: block;
  top: 100%;
  right: 15px;
  margin-top: 10px;
  padding: 20px 40px;
  background-color: $dropdown-color;
  box-shadow: 1px 15px 15px rgba(1, 1, 1, 0.1);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
  z-index: 1000;

  &::after {
    content: "";
    position: absolute;
    right: 25px;
    top: calc(-2 * $triangle-size);
    border: $triangle-size solid transparent;
    border-bottom: $triangle-size solid $dropdown-color;
    @media (max-width: 720px) {
      & {
        right: 20px;
      }
    }
  }

  &__link {
    display: block;
    font-size: 20px;
    line-height: 2;
    color: $dropdown-link-color;
    @media (max-width: 720px) {
      & {
        font-size: 24px;
        line-height: 1.8;
      }
    }
  }

  &__nav hr {
    height: 2px;
    width: 100%;
    margin: 15px 0;
    background-color: #eee;
  }

  &_open {
    opacity: 1;
    visibility: visible;
  }
}

/* The switch - the box around the slider */
$switch-width: 36px;
$switch-height: 22px;

.switch {
  position: relative;
  display: inline-block;
  width: $switch-width;
  height: $switch-height;
  margin-right: 20px;
}
/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  background-color: #bbb;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}
.slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}
input:checked + .slider {
  background-color: #2196f3;
  background-color: #248add;
}
input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}
input:checked + .slider:before {
  -webkit-transform: translateX(calc($switch-width / 2 - 4px));
  -ms-transform: translateX(calc($switch-width / 2 - 4px));
  transform: translateX(calc($switch-width / 2 - 4px));
  background-color: #111;
}
/* Rounded sliders */
.slider.round {
  border-radius: $switch-height;
}
.slider.round:before {
  border-radius: 50%;
}
</style>
