<template>
  <VeeForm @submit="save" :key="formKey" class="form">
    <UiFormField
      as="textarea"
      name="text"
      v-model="postCopy.text"
      rows="10"
      cols="30"
      rules="required"
    />
    <div class="form__btn-group">
      <button
        v-if="isDirty"
        @click.prevent="cancel"
        class="form__button btn btn_ghost"
      >
        Отмена
      </button>
      <button class="form__button btn btn_blue">
        {{ post.id ? "Сохранить изменения" : "Опубликовать" }}
      </button>
    </div>
  </VeeForm>
</template>

<script setup lang="ts">
const props = defineProps({
  post: {
    type: Object,
    default: () => ({ text: null }),
  },
});

const emit = defineEmits(["save", "cancel"]);

const postCopy = reactive({ ...props.post });
const isDirty = ref(!!props.post.text);
const formKey = ref(Math.random());

function save() {
  emit("save", { post: postCopy });
  postCopy.text = "";
  formKey.value = Math.random();
}

function cancel() {
  emit("cancel");
}
</script>

<style lang="scss" scoped>
.form__btn-group {
  margin-top: 0px;
}
</style>
