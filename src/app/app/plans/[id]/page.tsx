import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PlanDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

const planDetails = {
  free: {
    name: "Free Plan",
    price: "$0",
    description: "Perfect for getting started with LearnOV AI",
    features: [
      "Access to 10+ basic courses",
      "Community support via forums",
      "Basic progress tracking",
      "Limited AI recommendations",
      "Standard video quality"
    ]
  },
  pro: {
    name: "Pro Plan",
    price: "$19",
    description: "Most popular choice for serious learners",
    features: [
      "Access to 500+ premium courses",
      "Priority email support",
      "Advanced progress analytics",
      "Full AI personalization engine",
      "Offline course downloads",
      "Completion certificates",
      "HD video quality",
      "Mobile app access"
    ]
  },
  team: {
    name: "Team Plan",
    price: "$49",
    description: "Designed for teams and organizations",
    features: [
      "Everything in Pro plan",
      "Team management dashboard",
      "Advanced team analytics",
      "Custom learning paths",
      "API access for integrations",
      "Dedicated customer success manager",
      "Single Sign-On (SSO)",
      "Bulk user management",
      "Custom branding options"
    ]
  }
};

export default async function PlanDetailsPage({ params }: PlanDetailsPageProps) {
  const { id } = await params;
  const plan = planDetails[id as keyof typeof planDetails];

  if (!plan) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Plan not found</h1>
        <p className="text-muted-foreground">The requested plan does not exist.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            {plan.name}
          </h1>
          <p className="text-lg text-muted-foreground">
            {plan.description}
          </p>
          <div className="flex items-baseline justify-center space-x-1">
            <span className="text-4xl font-bold">{plan.price}</span>
            <span className="text-muted-foreground">/month</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>What&apos;s Included</CardTitle>
            <CardDescription>
              Everything you get with the {plan.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Separator />
            <div className="flex flex-col space-y-4">
              <Button size="lg" className="w-full">
                {id === "free" ? "Get Started Free" : `Subscribe to ${plan.name}`}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                {id === "free" 
                  ? "No credit card required" 
                  : "Cancel anytime. 30-day money-back guarantee."
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}