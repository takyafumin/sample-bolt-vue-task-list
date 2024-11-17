export interface Task {
  id: number;
  title: string;
  completed: boolean;
  status: 'not_started' | 'pending' | 'first_approval' | 'second_approval' | 'completed' | 'cancelled';
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