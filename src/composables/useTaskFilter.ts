import { ref, computed } from 'vue';
import type { Task } from '../types/task';

export function useTaskFilter(tasks: Task[]) {
  const selectedStatuses = ref(['not_started', 'pending', 'first_approval', 'second_approval']);
  const selectedAssignee = ref('');
  const searchKeyword = ref('');
  const includeCompleted = ref(false);
  const fromDate = ref<Date | null>(null);
  const toDate = ref<Date | null>(null);

  const filteredTasks = computed(() => {
    return tasks.filter(task => {
      // ステータスフィルター
      if (!includeCompleted.value) {
        if (selectedStatuses.value.length > 0 && !selectedStatuses.value.includes(task.status)) return false;
      } else {
        if (selectedStatuses.value.length > 0 && !selectedStatuses.value.includes(task.status) && task.status !== 'completed') return false;
      }

      // 担当者フィルター
      if (selectedAssignee.value && task.assignee !== selectedAssignee.value) return false;

      // キーワード検索
      if (searchKeyword.value && !task.title.toLowerCase().includes(searchKeyword.value.toLowerCase())) return false;

      // 期日
      if (fromDate.value && task.dueDate && task.dueDate < new Date(fromDate.value)) return false;
      if (toDate.value && task.dueDate && task.dueDate > new Date(toDate.value)) return false;

      return true;
    });
  });

  return {
    selectedStatuses,
    selectedAssignee,
    searchKeyword,
    includeCompleted,
    fromDate,
    toDate,
    filteredTasks
  };
}