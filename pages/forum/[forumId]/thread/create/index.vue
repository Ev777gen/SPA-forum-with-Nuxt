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
import { IForum } from 'composables/useDatabase';

const route = useRoute();

const forumId: string = route.params.forumId?.toString();

const formIsDirty: Ref<boolean> = ref(false);

const forums = useState<IForum[]>("forums");
const isAsyncDataLoaded = useState<boolean>("isAsyncDataLoaded");
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
  try {
    startLoadingIndicator();
    await fetchForum({ id: forumId });
  } catch(error) {
    if (error instanceof Error) {
      alert(error.message);
    }
  } finally {
    stopLoadingIndicator();
  }
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
