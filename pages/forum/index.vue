<template>
  <div v-if="isAsyncDataLoaded">
    <h1 class="title">Добро пожаловать на форум!</h1>
    <ForumCategoryList :categories="categories" />
  </div>
</template>

<script setup>
const categories = useState("categories").value;
const isAsyncDataLoaded = useState("isAsyncDataLoaded").value;
const {
  fetchAllCategories,
  fetchForums,
  startLoadingIndicator,
  stopLoadingIndicator,
} = useDatabase();

fetchAsyncData();

async function fetchAsyncData() {
  //startLoadingIndicator();
  const categoriesToDisplay = await fetchAllCategories();
  const forumIds = categoriesToDisplay
    .map((category) => category.forumIds)
    .flat();
  await fetchForums({ ids: forumIds });
  //stopLoadingIndicator();
}
</script>

<style lang="scss" scoped>
.title {
  margin: 30px 0;
}
</style>
