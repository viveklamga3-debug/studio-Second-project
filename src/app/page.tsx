import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { imageTools, fileTools } from '@/lib/tools';
import type { Tool } from '@/lib/tools';
import { AdPlaceholder } from '@/components/ad-placeholder';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

function ToolCard({ tool, className }: { tool: Tool, className?: string }) {
  const Icon = tool.icon as LucideIcon;
  return (
    <Link href={tool.href} className={cn("block group", className)}>
      <Card className="h-full transition-all duration-200 ease-in-out hover:shadow-md hover:-translate-y-1 hover:border-primary">
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="p-3 rounded-md bg-accent">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold">{tool.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>{tool.description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}

function ToolGrid({ title, tools }: { title: string; tools: Tool[] }) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 font-headline">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map(tool => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="w-full">
      <header className="text-center py-12 md:py-20 border-b">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-primary font-headline">
          MediaMaestro
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
          Your complete suite of simple, fast, and free tools for images and files.
        </p>
      </header>
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-9">
            <ToolGrid title="Image Tools" tools={imageTools} />
            <ToolGrid title="File Tools" tools={fileTools} />
          </div>
          <aside className="lg:col-span-3 lg:sticky top-24 self-start">
             <div className="space-y-8">
                <AdPlaceholder className="h-64" title="Sidebar Ad (Desktop)" />
                <AdPlaceholder className="h-64" title="Sidebar Ad 2 (Desktop)" />
             </div>
          </aside>
        </div>
      </div>

       <footer className="container mx-auto px-4 py-8">
          <div className="border-t pt-8">
            <AdPlaceholder className="h-24 w-full mb-8" title="Footer Ad" />
            <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} MediaMaestro. All rights reserved.</p>
              <nav className="flex items-center gap-4 mt-4 sm:mt-0 flex-wrap justify-center">
                <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                <Link href="/terms-and-conditions" className="hover:text-primary transition-colors">Terms & Conditions</Link>
                <Link href="/cookie-policy" className="hover:text-primary transition-colors">Cookie Policy</Link>
                <Link href="/disclaimer" className="hover:text-primary transition-colors">Disclaimer</Link>
                <Link href="/refund-and-cancellation" className="hover:text-primary transition-colors">Refund & Cancellation</Link>
                <Link href="/shipping-policy" className="hover:text-primary transition-colors">Shipping Policy</Link>
                <Link href="/contact-us" className="hover:text-primary transition-colors">Contact Us</Link>
              </nav>
            </div>
          </div>
      </footer>
    </div>
  );
}
