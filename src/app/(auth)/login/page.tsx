"use client";

import { Wrench } from "lucide-react";

export default function ComingSoonPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-4 h-[60vh]">
      <Wrench className="w-24 h-24 text-muted-foreground" />
      <h1 className="text-4xl font-bold">Coming Soon!</h1>
      <p className="text-lg text-muted-foreground max-w-md">
        This page is currently under construction. We're working hard to bring it to you as soon as possible.
      </p>
    </div>
  );
}
