import { generatePageMetadata } from '@/config/pages';
import SimplifiedReportForm from './SimplifiedReportForm';

export const metadata = generatePageMetadata('smart-reporting-center');

export default function SmartReportingCenterPage() {
  return (
    <main className="min-h-screen bg-background">
      <SimplifiedReportForm />
    </main>
  );
}