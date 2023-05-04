<template>
  <div v-if="isAsyncDataLoaded">
    <h1 class="title">Добро пожаловать на форум!</h1>
    <ForumCategoryList :categories="categories" />
  </div>
</template>

<script setup lang="ts">
const categories = useState<object[]>("categories");
const isAsyncDataLoaded = useState("isAsyncDataLoaded");

const {
  fetchAllCategories,
  fetchForums,
  startLoadingIndicator,
  stopLoadingIndicator,
} = useDatabase();

fetchAsyncData();

async function fetchAsyncData() {
  startLoadingIndicator();
  const categoriesToDisplay = await fetchAllCategories();
  const forumIds = categoriesToDisplay
    .map((category) => category.forumIds)
    .flat();
  await fetchForums({ ids: forumIds });
  stopLoadingIndicator();
}

definePageMeta({
  breadcrumb: "Категории",
});
</script>

<style lang="scss" scoped>
.title {
  margin: 30px 0;
}
</style>
