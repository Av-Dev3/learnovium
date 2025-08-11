import { Container } from "@/components/layout/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CreatePage() {
  return (
    <Container>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Create Learning Plan
          </h1>
          <p className="text-lg text-[var(--muted)]">
            Let&apos;s build your personalized learning journey
          </p>
        </div>
        
        {/* Wizard Intro */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle>AI-Powered Learning Wizard</CardTitle>
            <CardDescription>
              Our intelligent system will guide you through creating the perfect learning plan
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="w-24 h-24 mx-auto bg-[var(--brand)]/10 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-[var(--brand)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <p className="text-[var(--muted)] mb-6 max-w-2xl mx-auto">
              The wizard will ask you a few questions about your learning goals, experience level, 
              and preferred schedule. Based on your answers, our AI will create a customized plan 
              that adapts to your needs and helps you achieve your goals faster.
            </p>
            <div className="space-y-4">
              <Button size="lg" className="bg-[var(--brand)] hover:opacity-90">
                Start Wizard
              </Button>
              <p className="text-sm text-[var(--muted)]">
                Takes about 2-3 minutes to complete
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Start Options */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Quick Start</CardTitle>
              <CardDescription className="text-center">
                Jump right into learning
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button variant="outline" className="w-full">
                Get Started
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Browse Templates</CardTitle>
              <CardDescription className="text-center">
                Choose from popular plans
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button variant="outline" className="w-full">
                Browse
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Import Existing</CardTitle>
              <CardDescription className="text-center">
                Bring your current progress
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button variant="outline" className="w-full">
                Import
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}