import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsAndConditionsPage() {
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
          <CardTitle className="text-3xl">Terms & Conditions</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-stone dark:prose-invert max-w-none">
          <p>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p>By using mediamestro.com, you agree to these Terms.</p>

          <h2>1. Accounts</h2>
          <p>You must provide accurate information when creating an account. You are responsible for protecting your login details and for any activity under your account.</p>

          <h2>2. Plans & Pricing</h2>
          <ul>
            <li><strong>Free Plan:</strong> $0 (ads enabled)</li>
            <li><strong>Pro Plan:</strong> $2/month</li>
            <li><strong>Pro+ Plan:</strong> $9/month</li>
          </ul>
          <p>We reserve the right to update pricing with prior notice.</p>

          <h2>3. Acceptable Use</h2>
          <p>You agree NOT to use our service for:</p>
          <ul>
            <li>Harming or exploiting others</li>
            <li>Illegal downloads or activities</li>
            <li>Spam or automation abuse</li>
            <li>Copyright violation</li>
            <li>Distributing malware</li>
          </ul>

          <h2>4. Ads for Free Users</h2>
          <p>Our Free Plan is supported by advertisements served by Google AdSense. Paid users (Pro and Pro+) receive an ad-free experience.</p>

          <h2>5. Intellectual Property</h2>
          <p>All tools, features, content, and branding on this website are the exclusive property of MediaMaestro.</p>
          
          <h2>6. Termination</h2>
          <p>We may suspend or terminate accounts that violate our policies without notice.</p>
          
          <h2>7. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at: 📩 support@mediamestro.com</p>
        </CardContent>
      </Card>
    </div>
  );
}
