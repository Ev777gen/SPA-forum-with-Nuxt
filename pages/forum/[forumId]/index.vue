<template>
  <div v-if="isAsyncDataLoaded" class="forum">
    <div v-if="forum" class="forum__header">
      <div class="forum__details">
        <h1 class="forum__title title">{{ forum.name }}</h1>
        <p class="forum__description">{{ forum.description }}</p>
      </div>
      <NuxtLink
        v-if="authUser"
        :to="`/forum/${forum.id}/thread/create`"
        class="forum__button btn_orange btn_small"
      >
        Начать новую тему
      </NuxtLink>
    </div>

    <div class="forum__thread-list">
      <ForumThreadList :threads="threadsToDisplay || []" />
    </div>
    <div v-if="totalPagesCount > 1" class="pagination">
      <v-pagination
        v-model="page"
        :pages="totalPagesCount"
        active-color="#DCEDFF"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { IForum, IThread } from 'composables/useDatabase';

const route = useRoute();

const id: string = route.params.forumId?.toString();

const page = ref(parseInt(<string>route.query.page) || 1);
const threadsPerPage = 10;

const { authUser } = useAuth();
const { thread } = useDatabase();
const forums = useState<IForum[]>("forums");
const threads = useState<IThread[]>("threads");
const isAsyncDataLoaded = useState<boolean>("isAsyncDataLoaded");
const {
  fetchForum,
  fetchThreads,
  fetchThreadsByPage,
  fetchUsers,
  startLoadingIndicator,
  stopLoadingIndicator,
} = useDatabase();

const forum = computed(() => {
  return findItemById(forums.value, id) || {};
});

const threadsToDisplay = computed((): IThread[] | undefined => {
  if (!forum.value) return [];
  if (Array.isArray(threads.value)) {
    return threads.value
    .filter((currentThread) => currentThread.forumId === forum.value.id)
    .map((currentThread) => thread.value(currentThread.id));
  }
});

const threadsCount = computed(() => {
  if (!forum.value) return 0;
  return forum.value.threadIds?.length;
});

const totalPagesCount = computed(() => {
  if (!threadsCount.value) return 0;
  return Math.ceil(threadsCount.value / threadsPerPage);
});

watch(page, async (page) => {
  await navigateTo({ query: { page } });
});

fetchAsyncData();

async function fetchAsyncData() {
  try {
    startLoadingIndicator();
    const forum = await fetchForum({ id });
    if (forum) {
      const threads = await fetchThreadsByPage({
        ids: forum.threadIds,
        page: page.value,
        threadsPerPage,
      });

      if (threads) {
        const users = await fetchUsers({
          ids: threads.map((thread) => thread? thread.userId : ''),
        });
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
  } finally {
    stopLoadingIndicator();
  }
}

definePageMeta({
  middleware: "forum-404",
  breadcrumb: "Форум",
});
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
