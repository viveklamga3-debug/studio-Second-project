import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdPlaceholder } from "@/components/ad-placeholder";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button asChild variant="ghost" className="pl-1">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            All Tools
          </Link>
        </Button>
      </div>

      <div className="mb-8">
        <AdPlaceholder className="h-24 w-full" title="Top Banner Ad" />
      </div>

      <div className="bg-card border rounded-lg p-4 sm:p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}
