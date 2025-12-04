import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CookiePolicyPage() {
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
          <CardTitle className="text-3xl">Cookie Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-stone dark:prose-invert max-w-none">
          <p>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p>This Cookie Policy explains how MediaMaestro uses cookies and similar technologies on our website, mediamestro.com.</p>

          <h2>What are Cookies?</h2>
          <p>Cookies are small text files stored on your device (computer, tablet, or mobile) when you visit certain websites. They are used to 'remember' you and your preferences, either for a single visit (through a 'session cookie') or for multiple repeat visits (using a 'persistent cookie').</p>

          <h2>How We Use Cookies</h2>
          <p>We use cookies to:</p>
          <ul>
            <li><strong>Keep you logged in:</strong> Essential for managing your session if you have an account.</li>
            <li><strong>Analyze usage:</strong> To understand how our visitors use the site and to improve its performance.</li>
            <li><strong>Serve ads:</strong> We use Google AdSense, which uses cookies to show you relevant advertisements.</li>
            <li><strong>Improve site performance:</strong> To ensure our tools function correctly and efficiently.</li>
          </ul>

          <h2>Types of Cookies We Use</h2>
          <ul>
            <li><strong>Essential Cookies:</strong> These are strictly necessary for the website to function. Without them, services like user logins cannot be provided.</li>
            <li><strong>Analytics Cookies:</strong> These cookies collect information about how you use our website, such as which pages you visit most often. This data helps us optimize the site.</li>
            <li><strong>Advertising Cookies:</strong> These cookies are used by our advertising partner, Google AdSense, to deliver ads that are more relevant to you and your interests. They may be used to track your browser across other websites.</li>
          </ul>

          <h2>Managing Cookies</h2>
          <p>Most web browsers allow you to control cookies through their settings. You can set your browser to block cookies or to alert you when cookies are being sent. However, if you block essential cookies, some parts of our website may not function correctly.</p>
          <p>For more information on how to manage cookies, you can visit the help pages of your browser or <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer">www.aboutcookies.org</a>.</p>
          
          <h2>Contact Us</h2>
          <p>If you have any questions about our use of cookies, please contact us at: 📩 support@mediamestro.com</p>
        </CardContent>
      </Card>
    </div>
  );
}
