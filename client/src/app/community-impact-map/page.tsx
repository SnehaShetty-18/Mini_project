import { generatePageMetadata } from '@/config/pages';
import Header from '@/components/common/Header';
import CommunityMapInteractive from './CommunityMapInteractive';

export const metadata = generatePageMetadata('community-impact-map');

export default function CommunityImpactMapPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CommunityMapInteractive />
    </div>
  );
}