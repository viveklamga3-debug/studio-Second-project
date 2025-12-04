import Link from "next/link";
import { Wand2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Wand2 className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block font-headline">
            MediaMaestro
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center space-x-2">
            <Button variant="ghost">Pricing</Button>
            <Button>Login</Button>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
