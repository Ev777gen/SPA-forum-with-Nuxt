<template>
  <div class="list">
    <div
      v-for="(forum, index) in forums"
      :key="forum.id"
      :style="
        isDarkMode
          ? { backgroundColor: index % 2 === 0 ? '#666' : '#555' }
          : null
      "
      class="list__item forum"
    >
      <div class="forum__details">
        <NuxtLink :to="`/forum/${forum.id}`" class="forum__title link">
          {{ forum.name }}
        </NuxtLink>
        <p>{{ forum.description }}</p>
      </div>

      <div class="forum__threads-count desktop-only">
        {{ forum.threadIds?.length }}
        {{ forumThreadsCountWording(forum.threadIds?.length) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  forums: {
    type: Array,
    required: true,
  },
});

const { isDarkMode } = useDarkMode();
</script>

<style lang="scss" scoped>
.forum {
  &__details {
    flex-basis: 50%;
    @media (max-width: 720px) {
      & {
        flex-basis: 100%;
      }
    }
  }

  &__title {
    font-size: 18px;
  }

  &__threads-count {
    flex-basis: 12%;
    text-align: center;
    font-weight: 100;
  }
}
</style>
