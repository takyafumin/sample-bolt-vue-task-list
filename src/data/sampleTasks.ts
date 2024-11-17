import type { Task } from '../types/task';

// ランダムなタイトルを生成するためのサンプルデータ
const taskTitles = [
  '営業資料の作成',
  'プロジェクト計画書の更新',
  '顧客ミーティング',
  'システム設計レビュー',
  '予算計画の策定',
  '社内研修の実施',
  'マーケティング戦略の立案',
  '新規サービスの企画',
  'リスク分析の実施',
  '業務フローの見直し'
];

const tags = [
  '重要', '緊急', '企画', '営業', '開発', '管理', '研修',
  'マーケティング', '分析', 'レビュー', '会議', '資料作成'
];

// ランダムな日付を生成する関数
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// ランダムなタグを生成する関数
const randomTags = () => {
  const numTags = Math.floor(Math.random() * 3) + 1;
  const shuffled = [...tags].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numTags);
};

// サンプルタスクを生成する関数
const generateTasks = (): Task[] => {
  const tasks: Task[] = [];
  const startDate = new Date('2024-01-01');
  const endDate = new Date('2024-12-31');
  const assignees = ['yamada', 'suzuki', 'tanaka'];

  // 未着手タスク (35件)
  for (let i = 0; i < 35; i++) {
    tasks.push({
      id: i + 1,
      title: `${taskTitles[i % taskTitles.length]} ${Math.floor(i / 10) + 1}`,
      completed: false,
      status: 'not_started',
      assignee: assignees[i % assignees.length],
      dueDate: randomDate(startDate, endDate),
      tags: randomTags(),
      createdAt: new Date()
    });
  }

  // 申請中タスク (20件)
  for (let i = 0; i < 20; i++) {
    tasks.push({
      id: i + 36,
      title: `${taskTitles[i % taskTitles.length]} ${Math.floor(i / 10) + 4}`,
      completed: false,
      status: 'pending',
      assignee: assignees[i % assignees.length],
      dueDate: randomDate(startDate, endDate),
      tags: randomTags(),
      createdAt: new Date(Date.now() - 86400000 * (Math.random() * 30)),
      applicationReason: '承認が必要なため申請します',
      applicationDate: new Date(Date.now() - 86400000 * (Math.random() * 10))
    });
  }

  // 一次承認中タスク (10件)
  for (let i = 0; i < 10; i++) {
    tasks.push({
      id: i + 56,
      title: `${taskTitles[i % taskTitles.length]} ${Math.floor(i / 10) + 6}`,
      completed: false,
      status: 'first_approval',
      assignee: assignees[i % assignees.length],
      dueDate: randomDate(startDate, endDate),
      tags: randomTags(),
      createdAt: new Date(Date.now() - 86400000 * (Math.random() * 30)),
      applicationReason: '承認が必要なため申請します',
      applicationDate: new Date(Date.now() - 86400000 * (Math.random() * 20)),
      firstApprovalReason: '一次承認の確認を行います'
    });
  }

  // 二次承認中タスク (5件)
  for (let i = 0; i < 5; i++) {
    tasks.push({
      id: i + 66,
      title: `${taskTitles[i % taskTitles.length]} ${Math.floor(i / 10) + 7}`,
      completed: false,
      status: 'second_approval',
      assignee: assignees[i % assignees.length],
      dueDate: randomDate(startDate, endDate),
      tags: randomTags(),
      createdAt: new Date(Date.now() - 86400000 * (Math.random() * 30)),
      applicationReason: '承認が必要なため申請します',
      applicationDate: new Date(Date.now() - 86400000 * (Math.random() * 25)),
      firstApprovalReason: '一次承認の確認を行います',
      firstApprovalDate: new Date(Date.now() - 86400000 * (Math.random() * 15)),
      secondApprovalReason: '二次承認の確認を行います'
    });
  }

  // 完了タスク (30件)
  for (let i = 0; i < 30; i++) {
    tasks.push({
      id: i + 71,
      title: `${taskTitles[i % taskTitles.length]} ${Math.floor(i / 10) + 8}`,
      completed: true,
      status: 'completed',
      assignee: assignees[i % assignees.length],
      dueDate: randomDate(startDate, endDate),
      tags: randomTags(),
      createdAt: new Date(Date.now() - 86400000 * (Math.random() * 30)),
      applicationReason: '承認が必要なため申請します',
      applicationDate: new Date(Date.now() - 86400000 * (Math.random() * 25)),
      firstApprovalReason: '一次承認の確認を行います',
      firstApprovalDate: new Date(Date.now() - 86400000 * (Math.random() * 20)),
      secondApprovalReason: '二次承認の確認を行います',
      secondApprovalDate: new Date(Date.now() - 86400000 * (Math.random() * 15)),
      completionDate: new Date(Date.now() - 86400000 * (Math.random() * 5))
    });
  }

  return tasks;
};

export const sampleTasks = generateTasks();