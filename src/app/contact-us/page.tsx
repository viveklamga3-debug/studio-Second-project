import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us - MediaMaestro",
    description: "Get in touch with the MediaMaestro support team.",
};

export default function ContactUsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-6">
            <Button asChild variant="ghost" className="pl-1">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>
            </Button>
        </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Contact Us</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-stone dark:prose-invert max-w-none">
          <p>We're here to help! If you have any questions, feedback, or need support, please don't hesitate to reach out to us.</p>
          
          <h2>Email Support</h2>
          <p>The best way to contact us is by email. We aim to respond to all inquiries within 24-48 hours.</p>
          <div className="flex items-center gap-4">
            <Mail className="w-6 h-6 text-primary" />
            <a href="mailto:support@mediamestro.com" className="text-lg font-semibold text-primary hover:underline">
              support@mediamestro.com
            </a>
          </div>
          
          <h2>Please Note</h2>
          <p>Our support team is available during standard business hours. Inquiries sent outside of these hours will be addressed on the next business day.</p>
        </CardContent>
      </Card>
    </div>
  );
}
