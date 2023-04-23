<template>
  <div class="form_narrow">
    SignIn
    <!--<VeeForm @submit="signIn">
      <h1 class="form__title title">Войти</h1>

      <AppFormField
        label="e-mail"
        name="email"
        type="email"
        v-model="form.email"
        rules="required|email"
      />
      <AppFormField
        label="Пароль"
        name="password"
        type="password"
        v-model="form.password"
        rules="required"
      />

      <div class="form__btn-group">
        <div>
          <span>Еще не зарегистрированы? </span>
          <router-link :to="{name: 'RegisterForm'}">Создайте аккаунт</router-link>
        </div>
        <button
          type="submit"
          class="btn btn_blue"
          :disabled="!(form.email && form.password)"
        >
          Войти
        </button>
      </div>
    </VeeForm>-->
  </div>
</template>

<script setup lang="ts">
/*import { reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/AuthStore";

const form = reactive({
  email: "",
  password: "",
});

const { signInWithEmailAndPassword } = useAuthStore();

const router = useRouter();
const route = useRoute();

async function signIn() {
  try {
    await signInWithEmailAndPassword({ ...form });
    successRedirect();
  } catch (error) {
    alert(error.message);
  }
}

function successRedirect() {
  const redirectTo = route.query.redirectTo || { name: "HomeView" };
  router.push(redirectTo);
}*/
</script>

<style lang="scss" scoped>
.form__btn-group {
  justify-content: space-between;
  align-items: center;
}
</style>
