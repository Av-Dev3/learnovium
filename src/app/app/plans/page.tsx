import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PlansPage() {
  return (
    <Container>
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Learning Plans
          </h1>
          <p className="text-lg text-[var(--muted)]">
            Manage your personalized learning paths
          </p>
        </div>
        
        {/* No Plans State */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle>No plans yet</CardTitle>
            <CardDescription>
              Create your first learning plan to get started with personalized AI-powered education
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="w-20 h-20 mx-auto bg-[var(--brand)]/10 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-[var(--brand)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-[var(--muted)] mb-6 max-w-md mx-auto">
              Our AI will analyze your goals and create a customized learning path with daily lessons, 
              progress tracking, and adaptive content.
            </p>
            <Button asChild size="lg">
              <a href="/app/create">Create Your First Plan</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}