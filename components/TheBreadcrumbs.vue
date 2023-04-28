<template>
  <div class="breadcrumbs">
    <ul v-if="!isJustOneBreadcrumb">
      <li
        v-for="(breadcrumb, idx) in breadcrumbs"
        :key="breadcrumb.name"
        @click="changeRoute(breadcrumb)"
        :class="{ clickable: idx < breadcrumbs.length - 1 }"
      >
        {{ breadcrumb.nameToDisplay }}
      </li>
    </ul>
  </div>
</template>

<script setup>
const route = useRoute();

const breadcrumbs = useState("breadcrumbs") || [];
console.log(breadcrumbs.value);
const { changeRoute, initialiseBreadcrumbs, updateBreadcrumbs } =
  useBreadcrumbs();

// const isHomePage = computed(() => {
//   return route.path === "/";
// });
const isJustOneBreadcrumb = computed(() => {
  return breadcrumbs.value.length === 1;
});

watch(route, (newRoute) => {
  updateBreadcrumbs(newRoute);
});

// watch(breadcrumbs, () => {
//   if (breadcrumbs.length === 0) {
//     initialiseBreadcrumbs();
//   }
// });
</script>

<style scoped>
.breadcrumbs {
  margin-top: 20px;
}
ul {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  list-style-type: none;
  margin: 0;
}
ul > li {
  display: flex;
  float: left;
  width: auto;
  font-weight: bold;
  font-size: 0.8em;
  line-height: 1.3em;
  cursor: default;
  align-items: center;
}
ul > li:not(:last-child)::after {
  content: "/";
  float: right;
  font-size: 0.8em;
  margin: 0 0.5em;
  cursor: default;
}
.clickable {
  cursor: pointer;
  font-size: 1em;
  font-weight: normal;
}
</style>
