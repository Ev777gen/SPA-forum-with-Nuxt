<template>
  <div class="form_narrow">
    Register
    <!--<VeeForm @submit="register">
      <h1 class="form__title title">Форма регистрации</h1>

      <AppFormField
        v-model="form.name"
        name="name"
        label="Имя"
        rules="required"
      />
      <AppFormField
        v-model="form.username"
        name="username"
        label="Логин"
        rules="required|unique:users,username"
      />
      <AppFormField
        v-model="form.email"
        name="email"
        label="e-mail"
        rules="required|email|unique:users,email"
        type="email"
      />
      <AppFormField
        v-model="form.password"
        name="password"
        label="Пароль"
        rules="required|min:6"
        type="password"
      />

      <div class="form__btn-group">
        <button type="submit" class="btn_blue">Зарегистрироваться</button>
      </div>
    </VeeForm>-->
  </div>
</template>

<script setup lang="ts">
/*import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/AuthStore";

const router = useRouter();

const form = reactive({
  name: "",
  username: "",
  email: "",
  password: "",
});

const { registerUserWithEmailAndPassword } = useAuthStore();

async function register() {
  try {
    await registerUserWithEmailAndPassword(form);
    router.push("/");
  } catch (error) {
    alert(error.message);
  }
}*/
</script>
