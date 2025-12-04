import { Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/ month",
    description: "For casual users who need quick and simple tools.",
    features: [
      "Access to all basic tools",
      "Standard processing speed",
      "Community support",
      "Ad-supported",
    ],
    cta: "Get Started",
    href: "/signup",
  },
  {
    name: "Pro",
    price: "$2",
    period: "/ month",
    description: "For power users who need more features and faster processing.",
    features: [
      "Everything in Free, plus:",
      "Ad-free experience",
      "Faster processing times",
      "Higher file size limits",
      "Priority email support",
    ],
    cta: "Go Pro",
    href: "/signup?plan=pro",
    isFeatured: true,
  },
  {
    name: "Pro+",
    price: "$9",
    period: "/ month",
    description: "For professionals and teams who need unlimited access.",
    features: [
      "Everything in Pro, plus:",
      "Unlimited usage",
      "Access to premium tools",
      "Team collaboration features (coming soon)",
      "Dedicated support",
    ],
    cta: "Go Pro+",
    href: "/signup?plan=pro-plus",
  },
];

export default function PricingPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Choose the right plan for you
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Simple, transparent pricing. No hidden fees.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} className={cn("flex flex-col", plan.isFeatured && "border-primary shadow-lg")}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-1" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full" variant={plan.isFeatured ? "default" : "outline"}>
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center text-muted-foreground">
            <p>Need something different? <a href="mailto:support@mediamestro.com" className="text-primary hover:underline">Contact us</a> for custom solutions.</p>
        </div>
      </div>
    </div>
  );
}
