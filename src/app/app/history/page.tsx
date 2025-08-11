import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const recentActivity = [
  {
    type: "course_completed",
    title: "JavaScript Fundamentals",
    date: "2 days ago",
    duration: "2h 30m"
  },
  {
    type: "lesson_completed",
    title: "React Hooks Deep Dive",
    date: "1 week ago",
    duration: "45m"
  },
  {
    type: "quiz_completed",
    title: "TypeScript Basics Quiz",
    date: "1 week ago",
    score: "85%"
  },
  {
    type: "course_started",
    title: "Advanced React Patterns",
    date: "2 weeks ago",
    progress: "75%"
  }
];

const achievements = [
  {
    title: "First Course Completed",
    description: "Completed your first course",
    date: "1 month ago",
    icon: "🎓"
  },
  {
    title: "Streak Master",
    description: "7-day learning streak",
    date: "2 weeks ago",
    icon: "🔥"
  },
  {
    title: "Quiz Champion",
    description: "Scored 90%+ on 5 quizzes",
    date: "1 week ago",
    icon: "🏆"
  }
];

export default function HistoryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Learning History</h1>
          <p className="text-muted-foreground">
            Track your progress and celebrate your achievements.
          </p>
        </div>

        <Tabs defaultValue="activity" className="space-y-6">
          <TabsList>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your learning activities from the past month
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="space-y-1">
                      <h3 className="font-medium">{activity.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {activity.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} • {activity.date}
                      </p>
                      {activity.duration && (
                        <p className="text-sm text-muted-foreground">Duration: {activity.duration}</p>
                      )}
                      {activity.score && (
                        <p className="text-sm text-muted-foreground">Score: {activity.score}</p>
                      )}
                      {activity.progress && (
                        <p className="text-sm text-muted-foreground">Progress: {activity.progress}</p>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {achievements.map((achievement, index) => (
                <Card key={index}>
                  <CardHeader className="text-center">
                    <div className="text-4xl mb-2">{achievement.icon}</div>
                    <CardTitle className="text-lg">{achievement.title}</CardTitle>
                    <CardDescription>{achievement.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground">Earned {achievement.date}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="statistics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Learning Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">127h</div>
                  <p className="text-xs text-muted-foreground">
                    All time
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Courses Completed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">
                    +2 this month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Quiz Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87%</div>
                  <p className="text-xs text-muted-foreground">
                    Last 30 days
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Current Streak
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12 days</div>
                  <p className="text-xs text-muted-foreground">
                    Keep it up!
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}