<template>
  <div class="form_narrow">
    <VeeForm @submit="register">
      <h1 class="form__title title">Форма регистрации</h1>

      <UiFormField
        v-model="form.name"
        name="name"
        label="Имя"
        rules="required"
      />
      <UiFormField
        v-model="form.username"
        name="username"
        label="Логин"
        rules="required|unique:users,username"
      />
      <UiFormField
        v-model="form.email"
        name="email"
        label="e-mail"
        rules="required|email|unique:users,email"
        type="email"
      />
      <UiFormField
        v-model="form.password"
        name="password"
        label="Пароль"
        rules="required|min:6"
        type="password"
      />

      <div class="form__btn-group">
        <div>
          <span>Уже есть аккаунт? </span>
          <NuxtLink :to="`/user/signin`">Войти</NuxtLink>
        </div>
        <button type="submit" class="btn_blue">Зарегистрироваться</button>
      </div>
    </VeeForm>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();

const form = reactive({
  name: "",
  username: "",
  email: "",
  password: "",
});

const { registerUserWithEmailAndPassword } = useAuth();

async function register() {
  try {
    await registerUserWithEmailAndPassword(form);
    navigateTo("/");
  } catch (error) {
    alert(error.message);
  }
}

definePageMeta({
  isForGuests: true,
  breadcrumb: "Зарегистрироваться",
});
</script>

<style lang="scss" scoped>
.form__btn-group {
  justify-content: space-between;
  align-items: center;
}
</style>
