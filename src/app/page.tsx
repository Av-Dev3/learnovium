import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center space-y-8 mb-20">
        <div className="space-y-6">
          <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            AI-powered learning paths,{" "}
            <span className="text-[var(--brand)]">delivered daily.</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-lg text-[var(--muted)] sm:text-xl lg:text-2xl">
            LearnovAI builds a plan and sends bite-size lessons with reminders.
          </p>
        </div>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button size="lg" asChild>
            <Link href="/auth/sign-in">Get Started</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/app/dashboard">See Dashboard</Link>
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid gap-8 md:grid-cols-3 mb-20">
        <div className="text-center space-y-4 p-6 rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <div className="w-16 h-16 mx-auto bg-[var(--brand)]/10 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-[var(--brand)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="font-heading text-xl font-semibold">Plan</h3>
          <p className="text-[var(--muted)]">
            AI creates personalized learning paths based on your goals and schedule
          </p>
        </div>

        <div className="text-center space-y-4 p-6 rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <div className="w-16 h-16 mx-auto bg-[var(--brand)]/10 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-[var(--brand)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 5.754 5 7.5 5s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.523 18.246 19 16.5 19c-1.746 0-3.332-.477-4.5-1.253" />
            </svg>
          </div>
          <h3 className="font-heading text-xl font-semibold">Daily Lessons</h3>
          <p className="text-[var(--muted)]">
            Bite-size lessons delivered daily with smart reminders and notifications
          </p>
        </div>

        <div className="text-center space-y-4 p-6 rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <div className="w-16 h-16 mx-auto bg-[var(--brand)]/10 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-[var(--brand)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="font-heading text-xl font-semibold">Progress</h3>
          <p className="text-[var(--muted)]">
            Track your learning journey with detailed analytics and achievements
          </p>
        </div>
      </div>

      {/* Trust Section */}
      <div className="text-center space-y-6 p-8 rounded-lg border border-[var(--border)] bg-[var(--card)]">
        <h2 className="font-heading text-2xl font-semibold">Trusted by learners worldwide</h2>
        <p className="text-[var(--muted)] max-w-2xl mx-auto">
          Join thousands of learners who have transformed their skills with AI-powered education. 
          Our platform adapts to your learning style and helps you achieve your goals faster.
        </p>
        <div className="flex justify-center items-center gap-8 text-[var(--muted)]">
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--brand)]">10K+</div>
            <div className="text-sm">Active Learners</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--brand)]">500+</div>
            <div className="text-sm">Courses Available</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--brand)]">95%</div>
            <div className="text-sm">Completion Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}
