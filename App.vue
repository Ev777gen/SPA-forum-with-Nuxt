<template>
  <div
    class="app"
    :style="isDarkMode ? { backgroundColor: '#4f4f55', color: '#fff' } : null"
  >
    <header class="app__header">
      <TheNavbar />
    </header>
    <hr />
    <div class="app__body container">
      <aside
        class="app__sidebar desktop-only"
        :style="isDarkMode ? { backgroundColor: '#555' } : null"
      >
        <TheSidebar />
      </aside>
      <main class="app__content">
        <!-- <TheBreadcrumbs />-->
        <div v-show="isAsyncDataLoaded" class="app__page">
          <NuxtPage />
        </div>
        <div v-show="!isAsyncDataLoaded" class="app__spinner">
          <UiSpinner />
        </div>
        <!-- <router-view v-show="isAsyncDataLoaded" :key="`${$route.path}${JSON.stringify($route.query)}`" /> -->
        <!--<AppSpinner v-show="!isAsyncDataLoaded" class="app__spinner" />-->
      </main>
    </div>
  </div>
</template>

<script setup>
//import NProgress from 'nprogress';
import useDarkMode from "@/composables/useDarkMode";

//const router = useRouter();

//const { isAsyncDataLoaded } = storeToRefs(useForumStore());
const { authUser, fetchAuthUser } = useAuth();
const { isDarkMode } = useDarkMode();
const isAsyncDataLoaded = useState("isAsyncDataLoaded");

fetchAsyncData();

async function fetchAsyncData() {
  await fetchAuthUser();
  /*NProgress.configure({
    speed: 200,
    showSpinner: false
  });
  router.beforeEach(() => {
    NProgress.start();
  });
  router.afterEach(() => {
    setTimeout(() => NProgress.done(), 500);
  });*/
}
</script>

<style lang="scss">
@import "@/assets/scss/reset.scss";
@import "@/assets/scss/main.scss";
/*@import "~nprogress/nprogress.css";*/

$container-width: 1100px;
$content-width: 900px;
$header-height: 75px;

.container {
  display: flex;
  justify-content: space-between;
  max-width: $container-width;
  margin: 0px auto;
  padding: 0 15px;
}

.app {
  min-height: 100vh;
  background-color: #fff;

  &__header {
    position: fixed;
    top: 0;
    width: 100%;
    height: $header-height;
    background-color: #23374d;
    z-index: 999;
  }

  &__body {
    margin-top: $header-height;
  }

  &__content {
    width: $content-width;
    margin-left: $container-width - $content-width + 15px;
    @media (max-width: 720px) {
      & {
        margin-left: 0px;
      }
    }
  }

  &__sidebar {
    position: fixed;
    width: $container-width - $content-width;
    min-height: 100%;
    padding: 25px 15px;
    background-color: #f6f6f6;
  }

  &__spinner {
    margin-top: 40vh;
  }
}
/*
#nprogress .bar{
  background: #5ce0b0 !important;
}*/
</style>
