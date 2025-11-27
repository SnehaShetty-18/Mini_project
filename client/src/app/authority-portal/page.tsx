import { generatePageMetadata } from '@/config/pages';
import Header from '@/components/common/Header';
import AuthorityPortalInteractive from './components/AuthorityPortalInteractive';

export const metadata = generatePageMetadata('authority-portal');

export default function AuthorityPortalPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <AuthorityPortalInteractive />
    </main>
  );
}