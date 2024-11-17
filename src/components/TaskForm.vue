<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Task, Status } from '../types/task';
import { ASSIGNEE_OPTIONS } from '../data/constants';
import ProcessFlow from './ProcessFlow.vue';

const props = defineProps<{
  modelValue: boolean;
  task: Task | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'update': [task: Task];
}>();

const form = ref<Partial<Task>>({});

const selectedStatuses = ref<Status[]>(['not_started', 'pending']);

const resetForm = () => {
  if (props.task) {
    form.value = { ...props.task };
  }
};

watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    resetForm();
  }
});

watch(() => props.task, () => {
  resetForm();
}, { immediate: true });

const getNextActionLabel = (status: Status): string => {
  switch (status) {
    case 'not_started':
      return 'アサインする';
    case 'pending':
      return '申請する';
    case 'first_approval':
      return '一次承認する';
    case 'second_approval':
      return '完了する';
    default:
      return '';
  }
};

const handleSave = () => {
  if (form.value.id && form.value.title) {
    emit('update', form.value as Task);
    emit('update:modelValue', false);
  }
};

const handleNextAction = async () => {
  if (!form.value.id || !form.value.status) return;

  const now = new Date();
  const updatedTask = { ...form.value } as Task;

  switch (updatedTask.status) {
    case 'not_started':
      updatedTask.status = 'pending';
      updatedTask.applicationDate = now;
      break;
    case 'pending':
      updatedTask.status = 'first_approval';
      updatedTask.firstApprovalDate = now;
      break;
    case 'first_approval':
      updatedTask.status = 'second_approval';
      updatedTask.secondApprovalDate = now;
      break;
    case 'second_approval':
      updatedTask.status = 'completed';
      updatedTask.completed = true;
      updatedTask.completionDate = now;
      break;
  }

  emit('update', updatedTask);
  emit('update:modelValue', false);
};
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="90%"
    persistent
  >
    <v-card v-if="form.id">
      <v-card-title class="d-flex justify-space-between align-center pa-4">
        <div class="text-h5 font-weight-bold text-cyan-darken-2 border-bottom-2 border-cyan pb-2 w-100">
          {{ form.title }}
        </div>
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="$emit('update:modelValue', false)"
        ></v-btn>
      </v-card-title>

      <v-card-text class="pa-4">
        <ProcessFlow :status="form.status || 'not_started'" class="mb-6" />

        <v-container>
          <!-- 現在のステータスに応じたフォーム -->
          <div v-if="form.status === 'not_started'">
            <v-select
              v-model="form.assignee"
              :items="ASSIGNEE_OPTIONS"
              item-title="label"
              item-value="value"
              label="担当者"
              variant="outlined"
              class="mb-4"
            ></v-select>

            <v-text-field
              v-model="form.tags"
              label="タグ（カンマ区切り）"
              variant="outlined"
              class="mb-4"
            ></v-text-field>

            <v-text-field
              v-model="form.dueDate"
              label="期日"
              type="date"
              variant="outlined"
            ></v-text-field>
          </div>

          <div v-else-if="form.status === 'pending'">
            <v-textarea
              v-model="form.applicationReason"
              label="申請理由"
              variant="outlined"
              rows="3"
            ></v-textarea>
          </div>

          <div v-else-if="form.status === 'first_approval'">
            <v-textarea
              v-model="form.firstApprovalReason"
              label="一次承認理由"
              variant="outlined"
              rows="3"
            ></v-textarea>
          </div>

          <div v-else-if="form.status === 'second_approval'">
            <v-textarea
              v-model="form.secondApprovalReason"
              label="二次承認理由"
              variant="outlined"
              rows="3"
            ></v-textarea>
          </div>

          <!-- 過去の承認情報の表示 -->
          <v-card v-if="form.status !== 'not_started'" class="mt-6 bg-grey-lighten-4">
            <v-card-text>
              <div v-if="form.assignee" class="mb-2">
                <strong>担当者:</strong>
                {{ ASSIGNEE_OPTIONS.find(opt => opt.value === form.assignee)?.label }}
              </div>
              <div v-if="form.dueDate" class="mb-2">
                <strong>期日:</strong>
                {{ new Date(form.dueDate).toLocaleDateString('ja-JP') }}
              </div>
              <div v-if="form.tags" class="mb-2">
                <strong>タグ:</strong> {{ form.tags }}
              </div>
              <div v-if="form.applicationReason" class="mb-2">
                <strong>申請理由:</strong> {{ form.applicationReason }}
              </div>
              <div v-if="form.applicationDate" class="mb-2">
                <strong>申請日時:</strong>
                {{ new Date(form.applicationDate).toLocaleString('ja-JP') }}
              </div>
              <div v-if="form.firstApprovalReason" class="mb-2">
                <strong>一次承認理由:</strong> {{ form.firstApprovalReason }}
              </div>
              <div v-if="form.firstApprovalDate" class="mb-2">
                <strong>一次承認日時:</strong>
                {{ new Date(form.firstApprovalDate).toLocaleString('ja-JP') }}
              </div>
              <div v-if="form.secondApprovalReason" class="mb-2">
                <strong>二次承認理由:</strong> {{ form.secondApprovalReason }}
              </div>
              <div v-if="form.secondApprovalDate" class="mb-2">
                <strong>二次承認日時:</strong>
                {{ new Date(form.secondApprovalDate).toLocaleString('ja-JP') }}
              </div>
            </v-card-text>
          </v-card>
        </v-container>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn
          color="grey"
          variant="text"
          @click="$emit('update:modelValue', false)"
        >
          閉じる
        </v-btn>
        <v-btn
          v-if="form.status !== 'completed'"
          color="blue-darken-1"
          variant="text"
          @click="handleSave"
        >
          保存
        </v-btn>
        <v-btn
          v-if="form.status !== 'completed'"
          :color="form.status === 'second_approval' ? 'green-darken-1' : 'blue-darken-3'"
          @click="handleNextAction"
        >
          {{ getNextActionLabel(form.status || 'not_started') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.border-cyan {
  border-color: rgb(14, 116, 144);
}
</style>