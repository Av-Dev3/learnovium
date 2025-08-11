import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: [
      "Access to basic courses",
      "Community support",
      "Basic progress tracking",
      "Limited AI features"
    ]
  },
  {
    id: "pro",
    name: "Pro",
    price: "$19",
    description: "Most popular for individual learners",
    features: [
      "Access to all courses",
      "Priority support",
      "Advanced progress tracking",
      "Full AI personalization",
      "Offline access",
      "Certificates"
    ]
  },
  {
    id: "team",
    name: "Team",
    price: "$49",
    description: "Perfect for teams and organizations",
    features: [
      "Everything in Pro",
      "Team management",
      "Advanced analytics",
      "Custom learning paths",
      "API access",
      "Dedicated support"
    ]
  }
];

export default function PlansPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Choose Your Plan
          </h1>
          <p className="mx-auto max-w-[700px] text-lg text-muted-foreground">
            Select the perfect plan for your learning journey. Upgrade or downgrade at any time.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id} className={plan.name === "Pro" ? "border-primary" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {plan.name}
                  {plan.name === "Pro" && (
                    <span className="rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">
                      Popular
                    </span>
                  )}
                </CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={plan.name === "Pro" ? "default" : "outline"}
                  asChild
                >
                  <Link href={`/app/plans/${plan.id}`}>
                    {plan.name === "Free" ? "Get Started" : "Choose Plan"}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}