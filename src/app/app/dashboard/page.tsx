import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/layout/container";

export default function DashboardPage() {
  return (
    <Container>
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Dashboard
          </h1>
          <p className="text-[var(--muted)]">
            Welcome back! Here&apos;s your learning overview.
          </p>
        </div>
        
        {/* Today's Lesson Card */}
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Lesson</CardTitle>
            <CardDescription>Your personalized learning content for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-[var(--brand)]/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-[var(--brand)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 5.754 5 7.5 5s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.523 18.246 19 16.5 19c-1.746 0-3.332-.477-4.5-1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">No lesson scheduled</h3>
              <p className="text-[var(--muted)] mb-4">
                Create your first learning plan to get started with daily lessons.
              </p>
              <a 
                href="/app/create" 
                className="inline-flex items-center px-4 py-2 bg-[var(--brand)] text-white rounded-md hover:opacity-90 transition-opacity"
              >
                Create Plan
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}