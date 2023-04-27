<template>
  <div
    class="app"
    :style="isDarkMode ? { backgroundColor: '#5f5f65', color: '#fff' } : null"
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
        <div class="not-found">
          <h1 class="not-found__title title">Страница не найдена</h1>
          <span>Вернуться на </span>
          <NuxtLink to="/">главную</NuxtLink>.
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
defineProps(["error"]);
</script>

<style lang="scss" scoped>
.not-found {
  font-size: 16px;

  &__title {
    margin: 35px 0;
  }
}
</style>
