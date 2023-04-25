<template>
  <div v-if="isAsyncDataLoaded" class="profile">
    <div class="profile__card">
      <UserProfileCard
        v-if="!edit"
        :user="userToDisplay"
        @edit="() => (edit = true)"
      />
      <UserProfileCardEditor
        v-else
        :user="userToDisplay"
        @cancel="() => (edit = false)"
        @save="() => (edit = false)"
      />
    </div>
  </div>
</template>

<script setup>
const router = useRouter();
const route = useRoute();

const userId = route.params.id;

const { authUser } = useAuth();
const isAsyncDataLoaded = useState("isAsyncDataLoaded");
const { user, fetchUser, startLoadingIndicator, stopLoadingIndicator } =
  useDatabase();

const edit = ref(false);

const otherUser = computed(() => {
  if (userId) {
    return user.value(userId);
  } else {
    return null;
  }
});

const userToDisplay = computed(() => {
  return otherUser.value || authUser.value;
});

watch(userToDisplay, (newValue) => {
  if (newValue === null) {
    router.push("/");
  }
});

definePageMeta({
  middleware: "auth-required",
});

fetchAsyncData();

async function fetchAsyncData() {
  if (userId) {
    startLoadingIndicator();
    await fetchUser({ id: userId });
    stopLoadingIndicator();
  }
}
</script>

<style lang="scss">
/* 
  Карточка пользователя (шапка).
  Это общие стили для компонентов 
  UserProfileCard и UserProfileCardEditor.
*/
$card-header-height: 320px;
$card-background-cover-height: $card-header-height * 0.65;
$card-background-footer-height: $card-header-height -
  $card-background-cover-height - 4px;

/*$color-starting: #c4b7b2;
$color-middle: #b8a9a3;
$color-ending: #fff9f9;*/

$color-starting: #a18a82;
$color-middle: #beaaa0;
$color-ending: #f9f2f2;

.card {
  &__header {
    position: relative;
    margin: 15px 0;
    height: $card-header-height;
    border: 2px solid #eee;
    border-radius: 5px;
  }

  &__background_cover {
    height: $card-background-cover-height;
    /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#c4b7b2+0,b8a9a3+0,fff9f9+100 */
    background: $color-starting; /* Old browsers */
    background: -moz-linear-gradient(
      left,
      $color-starting 0%,
      $color-middle 0%,
      $color-ending 100%
    ); /* FF3.6-15 */
    background: -webkit-linear-gradient(
      left,
      $color-starting 0%,
      $color-middle 0%,
      $color-ending 100%
    ); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(
      to right,
      $color-starting 0%,
      $color-middle 0%,
      $color-ending 100%
    ); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=$color-starting, endColorstr=$color-ending, GradientType=1 ); /* IE6-9 */
    @media (max-width: 720px) {
      height: $card-background-cover-height * 1.1;
    }
  }

  &__background_footer {
    display: flex;
    justify-content: space-between;
    height: $card-background-footer-height;
    padding-left: 33%;
    background-color: #fff;
    & .card__name {
      font-size: 28px;
      font-weight: 700;
    }
    & p {
      padding-right: 25px;
      line-height: $card-background-footer-height;
    }
    @media (max-width: 720px) {
      & {
        flex-wrap: wrap;
        justify-content: center;
        padding: 0px 15px 0px 15px;
        height: $card-background-footer-height * 0.8;
      }
      & p {
        padding-right: 0px;
        line-height: $card-background-footer-height * 0.8;
      }
    }
  }

  &__avatar {
    position: absolute;
    bottom: 9%;
    left: 8%;
    border: 4px solid #fff;
    border-radius: 50%;
    @media (max-width: 720px) {
      & {
        bottom: 50%;
        left: 50%;
        transform: translate(-50%, 24%);
      }
    }
  }
}
</style>
