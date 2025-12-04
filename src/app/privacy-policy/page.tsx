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
          <p>
            This Privacy Policy describes how MediaMaestro ("we", "us", or "our")
            collects, uses, and discloses your information when you use our
            website (the "Service").
          </p>

          <h2>Information We Collect</h2>
          <p>
            We may collect information that you provide to us directly, such as
            when you contact us. The majority of our tools (like image and file
            processors) operate entirely within your browser. The files you
            select for processing are NOT uploaded to our servers.
          </p>

          <h2>Log Data and Analytics</h2>
          <p>
            Like many site operators, we collect information that your browser
            sends whenever you visit our Service ("Log Data"). This Log Data may
            include information such as your computer's Internet Protocol
            ("IP") address, browser type, browser version, the pages of our
            Service that you visit, the time and date of your visit, the time
            spent on those pages, and other statistics. We use this data to
            improve our service.
          </p>

          <h2>Cookies and Advertising</h2>
          <p>
            We use cookies to store information about visitors' preferences and
            to personalize or customize our web page content based upon
            visitors' browser type or other information that the visitor sends.
          </p>
          <p>
            We also use third-party advertisements on MediaMaestro to support
            our site. Some of these advertisers may use technology such as
            cookies and web beacons when they advertise on our site, which will
            also send these advertisers (such as Google through the Google
            AdSense program) information including your IP address, your ISP,
            the browser you used to visit our site, and in some cases, whether
            you have Flash installed. This is generally used for geotargeting
            purposes or showing certain ads based on specific sites visited.
          </p>
          <h3>Google AdSense & DoubleClick DART Cookie</h3>
          <p>
            Google, as a third-party vendor, uses cookies to serve ads on our
            Service. Google's use of the DART cookie enables it to serve ads to
            our users based on their visit to our Service and other sites on the
            Internet. Users may opt out of the use of the DART cookie by
            visiting the Google ad and content network privacy policy.
          </p>

          <h2>Your Choices</h2>
          <p>
            You can instruct your browser to refuse all cookies or to indicate
            when a cookie is being sent. However, if you do not accept cookies,
            you may not be able to use some portions of our Service.
          </p>

          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page.
            You are advised to review this Privacy Policy periodically for any
            changes.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
