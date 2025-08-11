import { Container } from "@/components/layout/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PlanDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PlanDetailsPage({ params }: PlanDetailsPageProps) {
  const { id } = await params;

  return (
    <Container>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Plan Details
          </h1>
          <p className="text-lg text-[var(--muted)]">
            Plan ID: {id}
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>What&apos;s Included</CardTitle>
              <CardDescription>Features and benefits of this plan</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span>Personalized learning path</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span>Daily lessons and reminders</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span>Progress tracking</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span>AI-powered recommendations</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>Next steps to begin your learning journey</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-[var(--muted)] mb-4">
                {id === "free" 
                  ? "No credit card required" 
                  : "Cancel anytime. 30-day money-back guarantee."
                }
              </p>
              <button className="w-full bg-[var(--brand)] text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity">
                Start Learning
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}