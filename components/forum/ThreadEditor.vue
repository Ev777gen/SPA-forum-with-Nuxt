<template>
  <VeeForm @submit="save">
    <UiFormField label="Заголовок" name="title" v-model="form.title" rules="required" />
    <UiFormField as="textarea" label="Сообщение" name="text" v-model="form.text" rules="required" rows="8" cols="140" />

    <div class="form__btn-group">
      <button @click.prevent="cancel()" class="btn btn_ghost">Отмена</button>
      <button class="btn btn_blue" type="submit" name="Publish">{{ isExisting ? 'Обновить' : 'Опубликовать' }}</button>
    </div>
  </VeeForm>
</template>

<script setup lang="ts">
const props = defineProps({
  title: { type: String, default: '' },
  text: { type: String, default: '' }
});

const emit = defineEmits(['dirty', 'clean', 'save', 'cancel']);

const form = reactive({
  title: props.title,
  text: props.text
});

const isExisting = computed(() => {
  return !!props.title;
});

watch(form, () => {
  if (form.title !== props.title || form.text !== props.text) {
    emit('dirty');
  } else {
    emit('clean');
  }
});

function save () {
  emit('clean');
  emit('save', { ...form });
}

function cancel () {
  emit('cancel');
}
</script>
