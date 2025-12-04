import type { Metadata } from 'next';
import { AdPlaceholder } from '@/components/ad-placeholder';
import { Uploader } from './components/uploader';
import { imageTools } from '@/lib/tools';

const tool = imageTools.find(t => t.id === 'background-remover')!;

export const metadata: Metadata = {
  title: `${tool.title} | MediaMaestro`,
  description: tool.description,
};

export default function BackgroundRemoverPage() {
  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl font-headline">{tool.title}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{tool.description}</p>
      </header>

      <Uploader />

      <AdPlaceholder className="h-48 w-full" title="Below Output Ad" />
    </div>
  );
}
