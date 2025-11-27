import type { Metadata } from 'next';
import HomepageInteractive from './HomepageInteractive';

export const metadata: Metadata = {
  title: 'Homepage - Civic AI Connect',
  description: 'Transform your community through AI-powered civic engagement. Report issues instantly, track progress transparently, and build stronger neighborhoods together with intelligent automation.',
};

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HomepageInteractive />
    </main>
  );
}