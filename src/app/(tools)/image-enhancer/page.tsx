import type { Metadata } from 'next';
import { AdPlaceholder } from '@/components/ad-placeholder';
import { Upscaler } from './components/upscaler';
import { imageTools } from '@/lib/tools';

const tool = imageTools.find(t => t.id === 'image-enhancer')!;

export const metadata: Metadata = {
  title: `${tool.title} | MediaMaestro`,
  description: tool.description,
};

export default function ImageEnhancerPage() {
  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl font-headline">{tool.title}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{tool.description}</p>
      </header>

      <Upscaler />

      <AdPlaceholder className="h-48 w-full" title="Below Output Ad" />
    </div>
  );
}
