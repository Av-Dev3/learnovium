import { AppHeader } from "@/components/app-header";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <AppHeader />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              About Learnovium
            </h1>
            <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto">
              Revolutionizing education with artificial intelligence that adapts to every learner
            </p>
          </div>

          {/* Story Section */}
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="font-heading text-3xl font-semibold">Our Story</h2>
              <p className="text-lg text-[var(--muted)] max-w-3xl mx-auto">
                                 Learnovium was born from a simple observation: traditional education follows a one-size-fits-all approach, 
                but every learner is unique. We believe that education should adapt to the individual, not the other way around.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4 p-6 rounded-lg border border-[var(--border)] bg-[var(--card)]">
                <h3 className="font-heading text-xl font-semibold text-[var(--brand)]">The Problem</h3>
                <p className="text-[var(--muted)]">
                  Traditional learning platforms offer static content that doesn&apos;t adapt to individual needs, 
                  learning pace, or preferred styles. This leads to frustration, disengagement, and poor retention.
                </p>
              </div>
              
              <div className="space-y-4 p-6 rounded-lg border border-[var(--border)] bg-[var(--card)]">
                <h3 className="font-heading text-xl font-semibold text-[var(--brand)]">Our Solution</h3>
                <p className="text-[var(--muted)]">
                  AI-powered learning that creates personalized paths, adapts content in real-time, 
                  and provides intelligent reminders to keep learners engaged and progressing.
                </p>
              </div>
            </div>
          </div>

          {/* Mission & Values */}
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="font-heading text-3xl font-semibold">Mission & Values</h2>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center space-y-4 p-6 rounded-lg border border-[var(--border)] bg-[var(--card)]">
                <div className="w-12 h-12 mx-auto bg-[var(--brand)]/10 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--brand)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-heading text-lg font-semibold">Innovation</h3>
                <p className="text-[var(--muted)] text-sm">
                  Continuously pushing the boundaries of what&apos;s possible in education technology
                </p>
              </div>
              
              <div className="text-center space-y-4 p-6 rounded-lg border border-[var(--border)] bg-[var(--card)]">
                <div className="w-12 h-12 mx-auto bg-[var(--brand)]/10 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--brand)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="font-heading text-lg font-semibold">Accessibility</h3>
                <p className="text-[var(--muted)] text-sm">
                  Making quality education available to everyone, regardless of background or location
                </p>
              </div>
              
              <div className="text-center space-y-4 p-6 rounded-lg border border-[var(--border)] bg-[var(--card)]">
                <div className="w-12 h-12 mx-auto bg-[var(--brand)]/10 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--brand)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-heading text-lg font-semibold">Excellence</h3>
                <p className="text-[var(--muted)] text-sm">
                  Committed to delivering the highest quality learning experience possible
                </p>
              </div>
            </div>
          </div>

          {/* Roadmap */}
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="font-heading text-3xl font-semibold">Roadmap</h2>
              <p className="text-lg text-[var(--muted)]">
                Our journey to transform education
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-6 rounded-lg border border-[var(--border)] bg-[var(--card)]">
                <div className="w-8 h-8 bg-[var(--brand)] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  1
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading text-lg font-semibold">Phase 1: Foundation (Q1 2024)</h3>
                  <p className="text-[var(--muted)]">
                    Core AI learning engine, personalized paths, and basic course library
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-6 rounded-lg border border-[var(--border)] bg-[var(--card)]">
                <div className="w-8 h-8 bg-[var(--brand)] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  2
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading text-lg font-semibold">Phase 2: Expansion (Q2 2024)</h3>
                  <p className="text-[var(--muted)]">
                    Advanced analytics, mobile app, and expanded course categories
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-6 rounded-lg border border-[var(--border)] bg-[var(--card)]">
                <div className="w-8 h-8 bg-[var(--brand)] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  3
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading text-lg font-semibold">Phase 3: Innovation (Q3 2024)</h3>
                  <p className="text-[var(--muted)]">
                    AR/VR integration, collaborative learning, and enterprise features
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-6 rounded-lg border border-[var(--border)] bg-[var(--card)]">
                <div className="w-8 h-8 bg-[var(--brand)] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  4
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading text-lg font-semibold">Phase 4: Global Scale (Q4 2024)</h3>
                  <p className="text-[var(--muted)]">
                    Multi-language support, global partnerships, and advanced AI capabilities
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}