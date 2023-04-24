<template>
  <div v-if="isAsyncDataLoaded" class="forum">
    <div v-if="forum" class="forum__header">
      <div class="forum__details">
        <h1 class="forum__title title">{{ forum.name }}</h1>
        <p class="forum__description">{{ forum.description }}</p>
      </div>
      <!--<NuxtLink
        v-if="authUser"
        :to="{name:'ThreadCreate', params: {forumId: forum.id}}"
        class="forum__button btn_orange btn_small"
      >
        Начать новую тему
      </NuxtLink>-->
    </div>
    Forum page
    <!--<div class="forum__thread-list">
      <ThreadList :threads="threadsToDisplay"/>
    </div>
    <div v-if="totalPagesCount > 1" class="pagination">
      <v-pagination
        v-model="page"
        :pages="totalPagesCount"
        active-color="#DCEDFF"
      />
    </div>-->
  </div>
</template>

<script setup>
import { findItemById } from "@/helpers";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const router = useRouter();
const route = useRoute();

const page = ref(parseInt(route.query.page) || 1);
const threadsPerPage = 10;

const { authUser } = useAuth();
//const { forums, threads, thread, isAsyncDataLoaded } = useDatabase();
const { thread } = useDatabase();
const forums = useState("forums");
const threads = useState("threads");
const isAsyncDataLoaded = useState("isAsyncDataLoaded");
const {
  fetchForum,
  fetchThreads,
  fetchThreadsByPage,
  fetchUsers,
  startLoadingIndicator,
  stopLoadingIndicator,
} = useDatabase();

const forum = computed(() => {
  return findItemById(forums.value, props.id);
});

const threadsToDisplay = computed(() => {
  if (!forum.value) return [];
  return threads.value
    .filter((currentThread) => currentThread.forumId === forum.value.id)
    .map((currentThread) => thread.value(currentThread.id));
});

const threadsCount = computed(() => {
  return forum.value.threadIds?.length || 0;
});

const totalPagesCount = computed(() => {
  if (!threadsCount.value) return 0;
  return Math.ceil(threadsCount.value / threadsPerPage);
});

watch(page, async (page) => {
  router.push({ query: { page } });
});

fetchAsyncData();

async function fetchAsyncData() {
  try {
    //startLoadingIndicator();
    const forum = await fetchForum({ id: props.id });
    const threads = await fetchThreadsByPage({
      ids: forum.threadIds,
      page: page.value,
      threadsPerPage,
    });
    const users = await fetchUsers({
      ids: threads.map((thread) => thread.userId),
    });
    //stopLoadingIndicator();
  } catch (err) {
    console.log(err);
    //stopLoadingIndicator();
  }
}
</script>

<style lang="scss" scoped>
.forum {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 30px;
  }

  &__details {
    flex-basis: 50%;
  }

  &__description {
    margin: 10px 0 15px 0;
    font-size: 16px;
  }

  &__button {
    align-self: flex-start;
    margin-left: 15px;
    text-align: center;
  }

  @media (max-width: 720px) {
    &__details {
      flex-basis: 100%;
    }
    &__button {
      padding: 5px;
    }
  }
}
.pagination {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}
</style>
