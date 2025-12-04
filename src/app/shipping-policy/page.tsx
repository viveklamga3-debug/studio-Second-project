import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Shipping Policy - MediaMaestro",
    description: "Information about the shipping policy for MediaMaestro's digital services.",
};

export default function ShippingPolicyPage() {
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
          <CardTitle className="text-3xl">Shipping Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-stone dark:prose-invert max-w-none">
          <p>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          
          <h2>Digital Services</h2>
          <p>MediaMaestro is a Software-as-a-Service (SaaS) application that provides digital tools and services. All our products are delivered electronically through our website, and no physical products are shipped.</p>
          
          <h2>Service Access</h2>
          <p>Upon successful payment for our Pro or Pro+ subscription plans, your account will be upgraded immediately, and you will gain access to the premium features associated with your chosen plan. Access is tied to your user account and is available as long as your subscription is active.</p>

          <h2>No Shipping Costs</h2>
          <p>As we only provide digital services, there are no shipping costs, and you will not be asked to provide a shipping address.</p>

          <h2>Contact Us</h2>
          <p>If you have any questions about our services or your subscription, please do not hesitate to <Link href="/contact-us">contact us</Link> at: 📩 support@mediamestro.com</p>
        </CardContent>
      </Card>
    </div>
  );
}
