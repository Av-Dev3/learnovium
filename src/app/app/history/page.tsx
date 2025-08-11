import { Container } from "@/components/layout/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HistoryPage() {
  return (
    <Container>
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Learning History
          </h1>
          <p className="text-lg text-[var(--muted)]">
            Track your learning progress and achievements
          </p>
        </div>
        
        {/* Placeholder Table */}
        <Card>
          <CardHeader>
            <CardTitle>Learning Sessions</CardTitle>
            <CardDescription>Your completed lessons and study sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                    <th className="text-left py-3 px-4 font-medium">Lesson</th>
                    <th className="text-left py-3 px-4 font-medium">Duration</th>
                    <th className="text-left py-3 px-4 font-medium">Score</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[var(--border)]/50">
                    <td className="py-8 px-4 text-center text-[var(--muted)]" colSpan={5}>
                      <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto bg-[var(--brand)]/10 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-[var(--brand)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 5.754 5 7.5 5s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.523 18.246 19 16.5 19c-1.746 0-3.332-.477-4.5-1.253" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">No learning sessions yet</h3>
                          <p className="text-[var(--muted)]">
                            Complete your first lesson to start building your learning history
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total Time</CardTitle>
              <CardDescription>Time spent learning</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0h 0m</p>
              <p className="text-xs text-[var(--muted)]">Start learning to see your progress</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Lessons Completed</CardTitle>
              <CardDescription>Total lessons finished</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-[var(--muted)]">Complete your first lesson</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Current Streak</CardTitle>
              <CardDescription>Days of consistent learning</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-[var(--muted)]">Build your learning habit</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}