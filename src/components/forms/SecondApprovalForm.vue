<script setup lang="ts">
import type { Task } from '../../types/task';

const props = defineProps<{
  form: Partial<Task>;
}>();

const emit = defineEmits<{
  'update:form': [Partial<Task>];
}>();

const updateForm = (key: keyof Task, value: any) => {
  emit('update:form', { ...props.form, [key]: value });
};
</script>

<template>
  <v-textarea
    v-model="props.form.secondApprovalReason"
    label="二次承認理由"
    variant="outlined"
    rows="3"
    @update:model-value="(value: any) => updateForm('secondApprovalReason', value)"
  ></v-textarea>
</template>