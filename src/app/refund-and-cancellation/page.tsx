import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Refund & Cancellation Policy - MediaMaestro",
    description: "Read the refund and cancellation policy for MediaMaestro subscriptions.",
};

export default function RefundAndCancellationPage() {
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
          <CardTitle className="text-3xl">Refund & Cancellation Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-stone dark:prose-invert max-w-none">
          <p>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          
          <h2>Subscriptions</h2>
          <p>Our Pro ($2/month) and Pro+ ($9/month) plans are recurring subscriptions. You can cancel your subscription at any time from your account dashboard. Your subscription will remain active until the end of the current billing cycle.</p>
          
          <h2>Refunds</h2>
          <p>We do not offer automatic refunds for subscription renewals. It is the user's responsibility to cancel their subscription before the renewal date if they do not wish to continue.</p>
          <p>However, we may consider refunds on a case-by-case basis under specific circumstances, such as:</p>
          <ul>
            <li>A major tool malfunction or site error preventing you from using the services you paid for.</li>
            <li>Billing errors attributable to our system.</li>
          </ul>
          <p>To request a refund, please contact our support team at 📩 support@mediamestro.com with your account details and the reason for your request. We will review your case and respond within 5-7 business days.</p>

          <h2>Cancellation</h2>
          <p>You can cancel your subscription at any time. The cancellation will take effect at the end of your current paid term. After your subscription expires, your account will be automatically downgraded to the Free plan, and ads will be re-enabled.</p>

        </CardContent>
      </Card>
    </div>
  );
}
