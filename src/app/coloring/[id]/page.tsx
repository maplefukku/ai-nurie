import { ColoringPage } from '@/components/ColoringPage';

export default function ColoringPageWrapper({ params }: { params: { id: string } }) {
  return <ColoringPage id={params.id} />;
}