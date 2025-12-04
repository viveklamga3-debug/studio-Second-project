import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicyPage() {
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
          <CardTitle className="text-3xl">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-stone dark:prose-invert max-w-none">
          <p>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p>
            Welcome to MediaMaestro (“we”, “our”, “us”). This Privacy Policy explains how we collect, use, and protect your information when you use mediamestro.com.
          </p>

          <h2>1. Information We Collect</h2>
          <p>We collect the following types of data:</p>
          <h3>A. Information You Provide</h3>
          <ul>
            <li>Email address (for login or support)</li>
            <li>Account details (free, Pro, Pro+)</li>
            <li>Payment details (processed securely via third-party gateways)</li>
          </ul>
          <h3>B. Automatically Collected Data</h3>
          <ul>
            <li>IP address</li>
            <li>Browser type</li>
            <li>Device details</li>
            <li>Usage & analytics data</li>
            <li>Cookies and tracking technologies</li>
          </ul>
          <p>
            For our file and image processing tools, all operations are performed locally in your browser. Your files are never uploaded to our servers, ensuring your data remains private.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>We use your data to:</p>
          <ul>
            <li>Provide and improve our SaaS services</li>
            <li>Secure user accounts</li>
            <li>Handle payments (via third-party payment processors)</li>
            <li>Show personalized ads (for free users only)</li>
            <li>Analyze traffic and performance</li>
            <li>Provide customer support</li>
          </ul>
          
          <h2>3. Google AdSense & Third-Party Cookies</h2>
          <p>Our website uses Google AdSense to serve ads to free users. Google may use cookies, web beacons, and device identifiers to serve personalized or non-personalized ads, prevent invalid clicks, and improve the user ad experience.</p>
          <p>Users may opt-out of personalized advertising by visiting Google's Ad Settings: <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">https://www.google.com/settings/ads</a>.</p>

          <h2>4. Data Protection & Security</h2>
          <p>We implement security measures like SSL/HTTPS, encryption, and secure servers to protect your data. We NEVER sell your personal information.</p>

          <h2>5. GDPR Rights (EU Users)</h2>
          <p>If you are an EU resident, you have the right to access, correct, or request deletion of your personal data. You can also opt-out of tracking. To exercise these rights, please contact us at support@mediamestro.com.</p>

          <h2>6. CCPA (California Users)</h2>
          <p>If you are a California resident, you have the right to request disclosure or deletion of your stored data. We do not "sell" personal data as defined by the CCPA. To exercise your rights, contact us at support@mediamestro.com.</p>

          <h2>7. Children’s Privacy</h2>
          <p>Our service does not target and is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13.</p>
          
          <h2>8. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page.
            You are advised to review this Privacy Policy periodically for any
            changes.
          </p>

          <h2>9. Contact Us</h2>
          <p>For questions regarding this policy, please contact us at: 📩 support@mediamestro.com</p>
        </CardContent>
      </Card>
    </div>
  );
}
