<script setup lang="ts">
import { watch } from 'vue';

const props = defineProps<{
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}>();

const emit = defineEmits<{
  'update:show': [value: boolean];
}>();

watch(() => props.show, (newValue) => {
  if (newValue) {
    setTimeout(() => {
      emit('update:show', false);
    }, 3000);
  }
});
</script>

<template>
  <v-snackbar
    :model-value="show"
    @update:model-value="$emit('update:show', $event)"
    :color="type"
    location="top"
    timeout="3000"
  >
    {{ message }}
  </v-snackbar>
</template>