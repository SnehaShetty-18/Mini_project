import { generatePageMetadata } from '@/config/pages';
import Header from '@/components/common/Header';
import ProgressTrackerInteractive from './ProgressTrackerInteractive';

export const metadata = generatePageMetadata('progress-tracker');

export default function ProgressTrackerPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProgressTrackerInteractive />
      </main>
    </div>
  );
}