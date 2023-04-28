<template>
  <div v-if="isAsyncDataLoaded">
    <h1 class="title">
      Редактирование темы <i>{{ thread.title }}</i>
    </h1>

    <ForumThreadEditor
      :title="thread.title"
      :text="text"
      @save="save"
      @cancel="cancel"
      @dirty="formIsDirty = true"
      @clean="formIsDirty = false"
    />
  </div>
</template>

<script setup>
const route = useRoute();
const forumId = route.params.forumId;
const threadId = route.params.threadId;

const router = useRouter();

const formIsDirty = ref(false);

const threads = useState("threads");
const posts = useState("posts");
const isAsyncDataLoaded = useState("isAsyncDataLoaded");
const {
  fetchThread,
  updateThread,
  fetchPost,
  startLoadingIndicator,
  stopLoadingIndicator,
} = useDatabase();

const thread = computed(() => {
  return findItemById(threads.value, threadId);
});

const text = computed(() => {
  if (thread.value.postIds) {
    const post = findItemById(posts.value, thread.value.postIds[0]);
    return post ? post.text : "";
  } else {
    return "";
  }
});

fetchAsyncData();

async function fetchAsyncData() {
  startLoadingIndicator();
  const thread = await fetchThread({ id: threadId });
  await fetchPost({ id: thread.postIds[0] });
  stopLoadingIndicator();
}

async function save({ title, text }) {
  const thread = await updateThread({
    id: threadId,
    title,
    text,
  });
  router.push(`/forum/${forumId}/thread/${threadId}`);
}

function cancel() {
  router.push(`/forum/${forumId}/thread/${threadId}`);
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
  breadcrumb: "Редактировать тему",
});
</script>

<style scoped>
.title {
  margin: 35px 0;
}
</style>
