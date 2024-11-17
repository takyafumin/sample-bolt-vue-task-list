
<script setup lang="ts">
import { ASSIGNEE_OPTIONS } from '../../data/constants';
import { VDateInput } from 'vuetify/labs/VDateInput';
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
  <v-select
    v-model="props.form.assignee"
    :items="ASSIGNEE_OPTIONS"
    item-title="label"
    item-value="value"
    label="担当者"
    variant="outlined"
    class="mb-4"
    @update:model-value="(value: any) => updateForm('assignee', value)"
  ></v-select>

  <v-text-field
    v-model="props.form.tags"
    label="タグ（カンマ区切り）"
    variant="outlined"
    class="mb-4"
    @update:model-value="(value: any) => updateForm('tags', value)"
  ></v-text-field>

  <v-date-input
    v-model="props.form.dueDate"
    label="期日"
    variant="outlined"
    @update:model-value="(value: any) => updateForm('dueDate', value)"
  ></v-date-input>
</template>