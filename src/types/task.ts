export type Status = 'not_started' | 'pending' | 'first_approval' | 'second_approval' | 'completed' | 'cancelled';

export const StatusColors: Record<Status, string> = {
  not_started: 'grey',
  pending: 'blue',
  first_approval: 'orange',
  second_approval: 'purple',
  completed: 'green',
  cancelled: 'red',
};

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  status: Status;
  assignee: string;
  dueDate: Date | null;
  tags: string[];
  createdAt: Date;
  // 承認フロー関連のフィールド
  applicationReason?: string;
  applicationDate?: Date;
  firstApprovalReason?: string;
  firstApprovalDate?: Date;
  secondApprovalReason?: string;
  secondApprovalDate?: Date;
  completionDate?: Date;
}