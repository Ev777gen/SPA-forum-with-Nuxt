<template>
  <div class="form_narrow">
    <VeeForm @submit="signIn">
      <h1 class="form__title title">Войти</h1>

      <UiFormField
        label="e-mail"
        name="email"
        type="email"
        v-model="form.email"
        rules="required|email"
      />
      <UiFormField
        label="Пароль"
        name="password"
        type="password"
        v-model="form.password"
        rules="required"
      />

      <div class="form__btn-group">
        <div>
          <span>Еще не зарегистрированы? </span>
          <NuxtLink :to="`/user/register`">Создайте аккаунт</NuxtLink>
        </div>
        <button
          type="submit"
          class="btn btn_blue"
          :disabled="!(form.email && form.password)"
        >
          Войти
        </button>
      </div>
    </VeeForm>
  </div>
</template>

<script setup lang="ts">
const form = reactive({
  email: "",
  password: "",
});
const { signInUserWithEmailAndPassword } = useAuth();
const route = useRoute();

async function signIn() {
  try {
    await signInUserWithEmailAndPassword({ ...form });
    successRedirect();
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
    }
  }
}

function successRedirect() {
  const redirectTo: string = route.query.redirectTo?.toString() || "/";
  navigateTo(redirectTo);
}

definePageMeta({
  isForGuests: true,
  breadcrumb: "Войти",
});
</script>

<style lang="scss" scoped>
.form__btn-group {
  justify-content: space-between;
  align-items: center;
}
</style>
