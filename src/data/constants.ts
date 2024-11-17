export const ASSIGNEE_OPTIONS = [
  { value: 'yamada', label: '山田太郎' },
  { value: 'suzuki', label: '鈴木花子' },
  { value: 'tanaka', label: '田中一郎' }
] as const;

export const STATUS_OPTIONS = [
  { value: 'not_started', label: '未着手', color: 'grey' },
  { value: 'pending', label: '申請中', color: 'amber' },
  { value: 'first_approval', label: '一次承認中', color: 'light-blue' },
  { value: 'second_approval', label: '二次承認中', color: 'blue' },
  { value: 'completed', label: '完了', color: 'green' },
  { value: 'cancelled', label: '破棄', color: 'red' }
] as const;