<script setup lang="ts">
import { computed } from 'vue';
import type { Task } from '../types/task';

const props = defineProps<{
  tasks: Task[];
}>();

const totalIncomplete = computed(() => {
  return props.tasks.filter(task => !task.completed).length;
});

const overdueTasksCount = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return props.tasks.filter(task =>
    !task.completed &&
    task.dueDate &&
    new Date(task.dueDate) <= today
  ).length;
});

const firstApprovalCount = computed(() => {
  return props.tasks.filter(task => task.status === 'first_approval').length;
});

const secondApprovalCount = computed(() => {
  return props.tasks.filter(task => task.status === 'second_approval').length;
});

const completedThisMonth = computed(() => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  return props.tasks.filter(task =>
    task.status === 'completed' &&
    task.completionDate &&
    new Date(task.completionDate) >= startOfMonth
  ).length;
});

const emit = defineEmits<{
  (e: 'filter-status', status: string): void;
  (e: 'filter-overdue'): void;
  (e: 'filter-incomplete'): void;
}>();

const handleFilterStatus = (status: string) => {
  emit('filter-status', status);
};

const handleFilterOverdue = () => {
  emit('filter-overdue');
};

const handleFilterIncomplete = () => {
  emit('filter-incomplete');
};
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
    <!-- 未完了タスク -->
    <v-card class="bg-blue-lighten-5" @click="handleFilterIncomplete">
      <v-card-text>
        <div class="d-flex align-center mb-2">
          <v-icon
            icon="mdi-clipboard-text-outline"
            size="28"
            class="mr-2 text-blue-darken-2"
          ></v-icon>
          <div class="text-subtitle-1 font-weight-medium">未完了</div>
        </div>
        <div class="text-h4 font-weight-bold text-blue-darken-2">
          {{ totalIncomplete }}
          <span class="text-subtitle-1 font-weight-regular">件</span>
        </div>
      </v-card-text>
    </v-card>

    <!-- 期日超過タスク -->
    <v-card class="bg-red-lighten-5" @click="handleFilterOverdue">
      <v-card-text>
        <div class="d-flex align-center mb-2">
          <v-icon
            icon="mdi-alert-circle-outline"
            size="28"
            class="mr-2 text-red-darken-2"
          ></v-icon>
          <div class="text-subtitle-1 font-weight-medium">期日超過</div>
        </div>
        <div class="text-h4 font-weight-bold text-red-darken-2">
          {{ overdueTasksCount }}
          <span class="text-subtitle-1 font-weight-regular">件</span>
        </div>
      </v-card-text>
    </v-card>

    <!-- 一次承認中 -->
    <v-card class="bg-amber-lighten-5" @click="handleFilterStatus('first_approval')">
      <v-card-text>
        <div class="d-flex align-center mb-2">
          <v-icon
            icon="mdi-account-check-outline"
            size="28"
            class="mr-2 text-amber-darken-2"
          ></v-icon>
          <div class="text-subtitle-1 font-weight-medium">一次承認中</div>
        </div>
        <div class="text-h4 font-weight-bold text-amber-darken-2">
          {{ firstApprovalCount }}
          <span class="text-subtitle-1 font-weight-regular">件</span>
        </div>
      </v-card-text>
    </v-card>

    <!-- 二次承認中 -->
    <v-card class="bg-light-blue-lighten-5" @click="handleFilterStatus('second_approval')">
      <v-card-text>
        <div class="d-flex align-center mb-2">
          <v-icon
            icon="mdi-account-check"
            size="28"
            class="mr-2 text-light-blue-darken-2"
          ></v-icon>
          <div class="text-subtitle-1 font-weight-medium">二次承認中</div>
        </div>
        <div class="text-h4 font-weight-bold text-light-blue-darken-2">
          {{ secondApprovalCount }}
          <span class="text-subtitle-1 font-weight-regular">件</span>
        </div>
      </v-card-text>
    </v-card>

    <!-- 今月の完了 -->
    <v-card class="bg-green-lighten-5" @click="handleFilterStatus('completed')">
      <v-card-text>
        <div class="d-flex align-center mb-2">
          <v-icon
            icon="mdi-check-circle-outline"
            size="28"
            class="mr-2 text-green-darken-2"
          ></v-icon>
          <div class="text-subtitle-1 font-weight-medium">今月の完了</div>
        </div>
        <div class="text-h4 font-weight-bold text-green-darken-2">
          {{ completedThisMonth }}
          <span class="text-subtitle-1 font-weight-regular">件</span>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>