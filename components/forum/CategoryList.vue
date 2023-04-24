<template>
  <div class="list" v-for="category in categories" :key="category.id">
    <h2 class="list__title">{{ category.name }}</h2>
    <ForumList :forums="getForumsForCategory(category)" />
  </div>
</template>

<script setup>
const props = defineProps({
  categories: {
    type: Array,
    required: true,
  },
});

const forums = useState("forums").value;

function getForumsForCategory(category) {
  return forums.filter((forum) => forum.categoryId === category.id);
}
</script>
