import { cn } from '@/lib/utils';
import { Megaphone } from 'lucide-react';

type AdPlaceholderProps = {
  className?: string;
  title?: string;
};

export function AdPlaceholder({ className, title = "Ad Placeholder" }: AdPlaceholderProps) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 text-muted-foreground",
        className
      )}
    >
      <div className="flex flex-col items-center gap-2">
        <Megaphone className="h-8 w-8" />
        <span className="text-sm font-medium">{title}</span>
      </div>
    </div>
  );
}
