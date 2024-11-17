
import { ref, computed } from 'vue';
import type { Task } from '../types/task';

export function useTaskFilter(tasks: Task[]) {
  const selectedStatuses = ref(['not_started', 'pending', 'first_approval', 'second_approval']);
  const selectedAssignee = ref('');
  const searchKeyword = ref('');
  const includeCompleted = ref(false);

  const filteredTasks = computed(() => {
    return tasks.filter(task => {
      // ステータスフィルター
      if (!includeCompleted.value && task.status === 'completed') return false;
      if (selectedStatuses.value.length > 0 && !selectedStatuses.value.includes(task.status)) return false;

      // 担当者フィルター
      if (selectedAssignee.value && task.assignee !== selectedAssignee.value) return false;

      // キーワード検索
      if (searchKeyword.value && !task.title.toLowerCase().includes(searchKeyword.value.toLowerCase())) return false;

      return true;
    });
  });

  return {
    selectedStatuses,
    selectedAssignee,
    searchKeyword,
    includeCompleted,
    filteredTasks
  };
}