import { AppLayout } from '@/components/app-layout';
import { PtasksPage } from '@/packages/ptasks';

export default function DashboardPage() {
  return (
    <AppLayout fullWidth>
      <PtasksPage />
    </AppLayout>
  );
}
