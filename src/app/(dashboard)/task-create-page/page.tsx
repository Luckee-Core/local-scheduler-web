import { AppLayout } from '@/components/app-layout';
import { TaskCreatePage } from '@/packages/task-create-page';

export default function TaskCreateRoutePage() {
  return (
    <AppLayout>
      <TaskCreatePage />
    </AppLayout>
  );
}
