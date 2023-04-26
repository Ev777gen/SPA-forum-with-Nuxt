<template>
  <div v-if="isAsyncDataLoaded" class="thread">
    <h1 class="thread__title title">
      <p>{{ thread.title }}</p>
      <NuxtLink
        v-if="thread.userId === authUser?.id"
        :to="`/forum/${$route.params.forumId}/thread/${id}/edit`"
      >
        <button class="thread__button btn_small btn_green">
          Редактировать тему
        </button>
      </NuxtLink>
    </h1>
    <p class="thread__info text_gray">
      <span class="thread__info_user desktop-only">
        Тема начата пользователем
        <NuxtLink :to="`/user/profile/${thread.author?.id}`">{{
          thread.author?.name
        }}</NuxtLink
        >,
        {{ localeDate(thread.publishedAt) }}
      </span>
      <span v-if="thread.repliesCount" class="thread__replies">
        {{ thread.repliesCount }}
        {{ repliesCountWording(thread.repliesCount) }}
        от
        {{
          thread.contributorsCount - 1 <= 1 ? 1 : thread.contributorsCount - 1
        }}
        {{
          thread.contributorsCount - 1 <= 1 ? "пользователя" : "пользователей"
        }}
      </span>
      <span v-else class="thread__replies">Нет ответов</span>
    </p>

    <ForumPostList :posts="threadPosts" />

    <ForumPostEditor v-if="authUser" @save="addPost" />
    <div v-else class="thread__no-auth-user">
      Чтобы написать пост, нужно
      <NuxtLink :to="`/user/signin?redirectTo=${$route.path}`"
        >Войти</NuxtLink
      >
      или
      <NuxtLink :to="`/user/register?redirectTo=${$route.path}`"
        >Зарегистрироваться</NuxtLink
      >
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const id = route.params.threadId;

const { authUser } = useAuth();
const posts = useState("posts");
const isAsyncDataLoaded = useState("isAsyncDataLoaded");
const { thread: threadGetter } = useDatabase();
const {
  fetchThread,
  fetchUsers,
  fetchPosts,
  createPost,
  startLoadingIndicator,
  stopLoadingIndicator,
} = useDatabase();

const thread = computed(() => {
  return threadGetter.value(id);
});

const threadPosts = computed(() => {
  return posts.value.filter((post) => post.threadId === id);
});

fetchAsyncData();

async function fetchAsyncData() {
  startLoadingIndicator();
  const thread = await fetchThread({ id: id });
  await fetchPostsWithUsers(thread.postIds);
  stopLoadingIndicator();
}

function addPost(eventData) {
  const post = {
    ...eventData.post,
    threadId: id,
  };
  createPost(post);
}

async function fetchPostsWithUsers(ids) {
  // Загружаем из базы данных посты
  const posts = await fetchPosts({ ids });
  // Загружаем id пользователей, написавших эти посты
  const userIds = posts.map((post) => post.userId).concat(thread.value.userId);
  await fetchUsers({ ids: userIds });
}
</script>

<style lang="scss" scoped>
.thread {
  &__title {
    display: flex;
    justify-content: space-between;
    margin: 20px 0;
  }

  &__info {
    display: flex;
    justify-content: space-between;
  }

  &__replies {
    justify-self: flex-end;
    text-align: right;
  }

  &__no-auth-user {
    margin: 30px 0;
    text-align: center;
    font-size: 16px;
  }
}
</style>
