<script setup lang="ts">
import { ref } from 'vue';
import type { Task } from '../types/task';
import { STATUS_OPTIONS, ASSIGNEE_OPTIONS } from '../data/constants';
import { sampleTasks } from '../data/sampleTasks';
import TaskForm from './TaskForm.vue';
import FlashMessage from './FlashMessage.vue';
import Dashboard from './Dashboard.vue';
import { useTaskFilter } from '../composables/useTaskFilter';
import { VDateInput } from 'vuetify/labs/VDateInput';

const tasks = ref<Task[]>(sampleTasks);
const showTaskForm = ref(false);
const selectedTask = ref<Task | null>(null);
const showFlash = ref(false);
const flashMessage = ref('');
const flashType = ref<'success' | 'error' | 'info'>('success');

const {
  /**
   * 選択中のステータス
   */
  selectedStatuses,
  /**
   * 担当者
   */
  selectedAssignee,
  /**
   * キーワード検索
   */
  searchKeyword,
  /**
   * 完了タスクを含むかどうか
   */
  includeCompleted,
  /**
   * 期日：開始日
   */
  fromDate,
  /**
   * 期日：終了日
   */
  toDate,
  /**
   * フィルタリングされたタスクリスト
   */
  filteredTasks,
} = useTaskFilter(tasks.value);

const openTaskForm = (task: Task) => {
  selectedTask.value = { ...task };
  showTaskForm.value = true;
};

const handleTaskUpdate = (updatedTask: Task) => {
  const index = tasks.value.findIndex(t => t.id === updatedTask.id);
  if (index !== -1) {
    tasks.value[index] = updatedTask;
    showFlash.value = true;
    flashMessage.value = 'タスクが更新されました';
    flashType.value = 'success';
  }
};

const formatDate = (date: Date | null | undefined) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('ja-JP');
};

const getStatusColor = (status: Task['status']) => {
  return STATUS_OPTIONS.find(opt => opt.value === status)?.color || 'grey';
};

const getAssigneeName = (value: string) => {
  return ASSIGNEE_OPTIONS.find(opt => opt.value === value)?.label || value;
};

/**
 * 未完了のタスクのみ表示
 */
const filterIncompleteTasks = () => {
  selectedStatuses.value = ['not_started', 'pending', 'first_approval', 'second_approval'];
  searchKeyword.value = '';
  selectedAssignee.value = '';
  fromDate.value = null;
  toDate.value = null;
  includeCompleted.value = false;
};

/**
 * タスクのステータスでフィルタリング
 * @param status
 */
const filterByStatus = (status: string) => {
  selectedStatuses.value = [status];
  searchKeyword.value = '';
  selectedAssignee.value = '';
  fromDate.value = null;
  toDate.value = null;
  includeCompleted.value = (status === 'completed') ? true : false;
};

/**
 * 期限切れのタスクのみ表示
 */
const filterByOverdue = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  searchKeyword.value = '';
  selectedAssignee.value = '';
  includeCompleted.value = false;
  fromDate.value = null;
  selectedStatuses.value = ['not_started', 'pending', 'first_approval', 'second_approval'];
  toDate.value = today;
};
</script>

<template>
  <v-container class="bg-cyan-50 min-h-screen py-8" fluid>
    <v-card class="mx-auto max-w-7xl bg-white shadow-lg rounded-lg">
      <v-card-title class="text-center text-2xl font-bold py-6 bg-cyan-600 text-white">
        タスク管理
      </v-card-title>

      <v-card-text class="p-6">
        <!-- ダッシュボード -->
        <Dashboard :tasks="tasks" @filter-status="filterByStatus" @filter-overdue="filterByOverdue"
          @filter-incomplete="filterIncompleteTasks" />

        <!-- フィルターセクション -->
        <div class="mb-6 p-4 bg-gray-50 rounded-lg">
          <div class="flex flex-wrap gap-4 items-center mb-4">
            <div class="flex-grow">
              <v-text-field v-model="searchKeyword" label="タスク名で検索" density="compact" variant="outlined"
                prepend-inner-icon="mdi-magnify" hide-details></v-text-field>
            </div>
            <v-select v-model="selectedAssignee" :items="ASSIGNEE_OPTIONS" item-title="label" item-value="value"
              label="担当者" density="compact" variant="outlined" hide-details class="max-w-xs" clearable></v-select>
          </div>
          <div class="flex flex-wrap gap-4 items-center mb-4">
            <v-date-input v-model="fromDate" label="from" variant="outlined" clearable=true
              @click:clear="fromDate = null">
            </v-date-input> 〜
            <v-date-input v-model="toDate" label="to" variant="outlined" clearable=true @click:clear="toDate = null">
            </v-date-input>
          </div>

          <div class="flex flex-wrap gap-2 items-center">
            <div v-for="status in STATUS_OPTIONS.filter(s => s.value !== 'completed' && s.value !== 'cancelled')"
              :key="status.value">
              <v-btn :color="selectedStatuses.includes(status.value) ? status.color : 'grey-lighten-3'"
                :variant="selectedStatuses.includes(status.value) ? 'elevated' : 'outlined'" @click="selectedStatuses = selectedStatuses.includes(status.value)
                  ? selectedStatuses.filter(s => s !== status.value)
                  : [...selectedStatuses, status.value]" size="small" class="mr-2">
                {{ status.label }}
              </v-btn>
            </div>
            <v-checkbox v-model="includeCompleted" label="完了を含む" hide-details density="compact"
              class="ml-4"></v-checkbox>
          </div>
        </div>

        <!-- タスクリスト -->
        <v-list v-if="filteredTasks.length > 0" class="bg-transparent">
          <v-list-item v-for="task in filteredTasks" :key="task.id" :class="{ 'bg-cyan-50': task.completed }"
            class="mb-4 rounded-lg transition-colors duration-200 hover:bg-gray-50 cursor-pointer"
            @dblclick="openTaskForm(task)">
            <template v-slot:prepend>
              <v-chip :color="getStatusColor(task.status)" class="mr-2" size="small">
                {{ STATUS_OPTIONS.find(opt => opt.value === task.status)?.label }}
              </v-chip>
            </template>

            <v-list-item-title class="text-lg font-medium mb-2">
              {{ task.title }}
            </v-list-item-title>

            <v-list-item-subtitle>
              <div class="flex flex-wrap gap-2 items-center">
                <v-chip color="blue-grey" size="small" class="mr-2">
                  <v-icon start icon="mdi-account"></v-icon>
                  {{ getAssigneeName(task.assignee) }}
                </v-chip>
                <v-chip v-if="task.dueDate" :color="new Date(task.dueDate) < new Date() ? 'red' : 'blue-grey'"
                  size="small" class="mr-2">
                  <v-icon start icon="mdi-calendar"></v-icon>
                  {{ formatDate(task.dueDate) }}
                </v-chip>
                <v-chip v-for="tag in task.tags" :key="tag" color="cyan-darken-2" size="small" class="mr-2">
                  <v-icon start icon="mdi-tag"></v-icon>
                  {{ tag }}
                </v-chip>
              </div>
            </v-list-item-subtitle>

            <template v-slot:append>
              <v-btn color="green" prepend-icon="mdi-pencil" variant="text" class="ml-2"
                @click.stop="openTaskForm(task)">
                編集
              </v-btn>
            </template>
          </v-list-item>
        </v-list>

        <v-sheet v-else class="d-flex align-center justify-center py-12 rounded-lg bg-grey-lighten-4">
          <div class="text-center">
            <v-icon icon="mdi-clipboard-text-outline" size="48" class="mb-4 text-grey"></v-icon>
            <div class="text-h6 text-grey">タスクが見つかりません</div>
            <div class="text-body-2 text-grey">検索条件を変更してください</div>
          </div>
        </v-sheet>
      </v-card-text>
    </v-card>

    <TaskForm v-if="showTaskForm" v-model="showTaskForm" :task="selectedTask" @update="handleTaskUpdate" />

    <FlashMessage v-model:show="showFlash" :message="flashMessage" :type="flashType" />
  </v-container>
</template>