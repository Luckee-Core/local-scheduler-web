import { AppLayout } from '@/components/app-layout';
import { TaskDetailPage } from '@/packages/task-detail-page';

export default function TaskDetailRoutePage() {
  return (
    <AppLayout>
      <TaskDetailPage />
    </AppLayout>
  );
}
