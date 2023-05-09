<template>
  <div v-if="activeUser" class="settings form_narrow">
    <h2 class="settings__title form__title title">Редактировать настройки</h2>

    <div class="settings__body">
      <div class="settings__email">
        <span>Почта: </span>
        <span>{{ activeUser.email }}</span>
      </div>

      <div class="settings__buttons">
        <button
          v-if="!isChanging"
          class="settings__button btn btn_orange"
          @click="isChangingEmail = true"
        >
          Изменить e-mail
        </button>
        <button
          v-if="!isChanging"
          class="settings__button btn btn_orange"
          @click="isChangingPassword = true"
        >
          Изменить пароль
        </button>
      </div>

      <div v-if="isChangingEmail" class="settings__email_edit">
        <h3 class="settings__subtitle">Введите новый e-mail и пароль</h3>
        <VeeForm @submit="changeEmail">
          <UiFormField
            name="new-email"
            label="Новый e-mail"
            v-model="newEmail"
            rules="required|email"
          />
          <UiFormField
            name="reauth-password"
            label="Пароль"
            v-model="password"
            type="password"
            rules="required"
          />
          <div class="form__btn-group">
            <button class="btn btn_ghost" @click.prevent="cancel">
              Отмена
            </button>
            <button class="btn btn_blue">Сохранить изменения</button>
          </div>
        </VeeForm>
      </div>

      <div v-if="isChangingPassword" class="settings__password_edit">
        <h3 class="settings__subtitle">Введите старый и новый пароль</h3>
        <VeeForm @submit="changePassword">
          <UiFormField
            name="reauth-password"
            label="Старый пароль"
            v-model="password"
            type="password"
            rules="required"
          />
          <UiFormField
            name="new-password"
            label="Новый пароль"
            v-model="newPassword"
            type="password"
            rules="required|min:6"
          />
          <div class="form__btn-group">
            <button class="btn btn_ghost" @click.prevent="cancel">
              Отмена
            </button>
            <button class="btn btn_blue">Сохранить изменения</button>
          </div>
        </VeeForm>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const isChangingEmail = ref(false);
const isChangingPassword = ref(false);
const newEmail = ref("");
const password = ref("");
const newPassword = ref("");

const { authUser: activeUser } = useAuth();
const { reauthenticate, updateUserEmail } = useAuth();
const { updateUser, startLoadingIndicator, stopLoadingIndicator } = useDatabase();

const isChanging = computed(() => {
  return (
    (isChangingEmail.value && !isChangingPassword.value) ||
    (!isChangingEmail.value && isChangingPassword.value)
  );
});

watch(activeUser, (newValue) => {
  if (newValue === null) {
    navigateTo("/");
  }
});

async function changeEmail() {
  try {
    startLoadingIndicator();
    if (activeUser.value) {
      await reauthenticate({
        email: activeUser.value.email,
        password: password.value,
      });
      await updateUserEmail({ email: newEmail.value });
      updateUser({ ...activeUser.value, email: newEmail.value });
    }
  } catch (error) {
    alert("Возникла ошибка при обновлении данных пользователя. Попробуйте повторить еще раз.");
  } finally {
    clearForm();
    isChangingEmail.value = false;
    stopLoadingIndicator();
  }
}

async function changePassword() {
  alert(
    "Я специально не реализовал этот функционал, чтобы избежать случайных проблем."
  );
  // try {
  //   startLoadingIndicator();
  //   await reauthenticate({ email: activeUser.value.email, password: password.value });
  //   await updatePassword({ password: newPassword.value });
  // } catch (error) {
  //   alert('Возникла ошибка при обновлении данных пользователя. Попробуйте повторить еще раз.');
  // } finally {
  //   clearForm();
  //   isChangingEmail.value = false;
  //   stopLoadingIndicator();
  // }

  // Если раскомментировать то, что выше,
  // то следующие две строки надо удалить
  clearForm();
  isChangingPassword.value = false;
}

function cancel() {
  isChangingEmail.value = false;
  isChangingPassword.value = false;
  clearForm();
}

function clearForm() {
  newEmail.value = "";
  password.value = "";
  newPassword.value = "";
}

definePageMeta({
  isAuthRequired: true,
  breadcrumb: "Настройки",
});
</script>

<style lang="scss" scoped>
.settings {
  &__subtitle {
    margin: 35px 0 20px 0;
    text-align: center;
    font-size: 18px;
  }

  &__email {
    font-size: 20px;
    & span:first-child {
      margin-right: 30px;
    }
  }

  &__buttons {
    margin-top: 35px;
  }

  &__button {
    width: 100%;
    margin-bottom: 20px;
  }
}
</style>
