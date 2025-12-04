import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Disclaimer - MediaMaestro",
    description: "Disclaimer for the use of tools and information provided on MediaMaestro.",
};

export default function DisclaimerPage() {
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
          <CardTitle className="text-3xl">Disclaimer</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-stone dark:prose-invert max-w-none">
          <p>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p>The information and tools provided by MediaMaestro on mediamestro.com are for general informational purposes only. All tools are provided on an “as-is” and “as-available” basis without any warranty of any kind, express or implied.</p>
          
          <h2>No Professional Advice</h2>
          <p>The content and tools on this website are not intended to be a substitute for professional advice. While we strive to provide accurate and functional tools, we make no representation or warranty of any kind concerning the accuracy, reliability, or completeness of any information or tool output.</p>
          
          <h2>Limitation of Liability</h2>
          <p>Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or our tools or reliance on any information provided on the site. Your use of the site and its tools and your reliance on any information is solely at your own risk.</p>
          
          <h2>User Responsibility</h2>
          <p>Users are solely responsible for the data they process using our tools and for the use of any output generated. We are not responsible for data loss or misuse of the tools. It is your responsibility to ensure you have the rights to any files you process and to verify the accuracy and suitability of any results.</p>
          
          <h2>External Links Disclaimer</h2>
          <p>The site may contain links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.</p>
          
          <h2>Contact Us</h2>
          <p>If you have any questions about this Disclaimer, you can contact us at: 📩 support@mediamestro.com</p>
        </CardContent>
      </Card>
    </div>
  );
}
