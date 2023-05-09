<template>
  <div class="list" v-for="category in categories" :key="category.id">
    <h2 class="list__title">{{ category.name }}</h2>
    <ForumList :forums="getForumsForCategory(category)" />
  </div>
</template>

<script setup lang="ts">
import { ICategory, IForum } from '~/composables/useDatabase';

const props = defineProps({
  categories: {
    type: Array<ICategory>,
    required: true,
  },
});

const forums = useState<IForum[]>("forums").value;

function getForumsForCategory(category: ICategory) {
  return forums.filter((forum) => forum.categoryId === category.id);
}
</script>
