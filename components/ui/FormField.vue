<template>
  <div class="form__input-group">
    <label :for="name" class="form__label">{{label}}</label>
    <VeeField
      :name="name"
      :label="label"
      :modelValue="modelValue"
      @input="$emit('modelUpdate', $event)"
      :id="name"
      class="form__input"
      v-bind="$attrs"
    />
    <VeeErrorMessage :name="name" class="form__error" />
  </div>
</template>

<script setup>
const props = defineProps({
  name: { type: String, required: true },
  label: { type: String, default: '' },
  modelValue: { type: String, default: '' }
});
</script>

<script>
export default {
  inheritAttrs: false,
}
</script>
