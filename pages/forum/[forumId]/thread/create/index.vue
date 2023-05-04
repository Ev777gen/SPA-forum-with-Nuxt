<template>
  <div v-if="isAsyncDataLoaded">
    <h1 class="title">
      Создать новую тему в форуме <i>{{ forum.name }}</i>
    </h1>

    <ForumThreadEditor
      @save="save"
      @cancel="cancel"
      @dirty="formIsDirty = true"
      @clean="formIsDirty = false"
    />
  </div>
</template>

<script setup lang="ts">

const router = useRouter();
const route = useRoute();

const forumId: string = route.params.forumId?.toString();

const formIsDirty = ref(false);

const forums = useState("forums");
const isAsyncDataLoaded = useState("isAsyncDataLoaded");
const {
  fetchForum,
  createThread,
  startLoadingIndicator,
  stopLoadingIndicator,
} = useDatabase();

const forum = computed(() => {
  return findItemById(forums.value, forumId) || {};
});

fetchAsyncData();

async function fetchAsyncData() {
  startLoadingIndicator();
  await fetchForum({ id: forumId });
  stopLoadingIndicator();
}

async function save({ title = "", text ="" }) {
  const thread = await createThread({
      title,
      text,
      forumId: forum.value.id,
    });
  navigateTo(`/forum/${forumId}/thread/${thread?.id}`);
}

function cancel() {
  navigateTo(`/forum/${forumId}`);
}

onBeforeRouteLeave(() => {
  if (formIsDirty.value) {
    const isConfirmed = window.confirm(
      "Вы уверены, что хотите покунуть страницу? Все несохраненные изменения будут потеряны."
    );
    if (!isConfirmed) return false;
  }
});

definePageMeta({
  isAuthRequired: true,
  breadcrumb: "Создать тему",
});
</script>

<style scoped>
.title {
  margin: 35px 0;
}
</style>
