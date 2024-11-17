<script setup lang="ts">
import type { Task } from '../types/task';

const props = defineProps<{
  status: Task['status'];
}>();

const steps = [
  { value: 'not_started', label: '未着手' },
  { value: 'pending', label: '申請中' },
  { value: 'first_approval', label: '一次承認中' },
  { value: 'second_approval', label: '二次承認中' },
  { value: 'completed', label: '完了' }
];

const getStepState = (stepValue: string) => {
  const statusIndex = steps.findIndex(s => s.value === props.status);
  const stepIndex = steps.findIndex(s => s.value === stepValue);
  
  if (stepIndex < statusIndex || (props.status === 'completed' && stepValue === 'completed')) {
    return 'completed';
  } else if (stepIndex === statusIndex) {
    return 'current';
  }
  return 'inactive';
};
</script>

<template>
  <v-stepper
    :model-value="steps.findIndex(s => s.value === status) + 1"
    class="bg-transparent"
  >
    <v-stepper-header class="bg-transparent">
      <template v-for="(step, i) in steps" :key="step.value">
        <v-stepper-item
          :value="i + 1"
          :complete="getStepState(step.value) === 'completed'"
          :selected="getStepState(step.value) === 'current'"
          :class="{
            'bg-green-lighten-5': getStepState(step.value) === 'completed',
            'bg-blue-lighten-5': getStepState(step.value) === 'current',
            'bg-grey-lighten-3': getStepState(step.value) === 'inactive'
          }"
        >
          {{ step.label }}
        </v-stepper-item>
        <v-divider
          v-if="i < steps.length - 1"
          :class="{
            'border-green': getStepState(step.value) === 'completed',
            'border-grey': getStepState(step.value) !== 'completed'
          }"
        ></v-divider>
      </template>
    </v-stepper-header>
  </v-stepper>
</template>

<style scoped>
.v-stepper-header {
  box-shadow: none !important;
  border: none !important;
}

.v-stepper-item {
  padding: 10px !important;
  flex: 1;
}

.border-green {
  border-color: rgb(34, 197, 94) !important;
}

.border-grey {
  border-color: rgb(209, 213, 219) !important;
}
</style>