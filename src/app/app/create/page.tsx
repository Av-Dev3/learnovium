import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CreatePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Create Content</h1>
          <p className="text-muted-foreground">
            Create new learning content with AI assistance.
          </p>
        </div>

        <Tabs defaultValue="course" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="course">Course</TabsTrigger>
            <TabsTrigger value="lesson">Lesson</TabsTrigger>
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
          </TabsList>

          <TabsContent value="course" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Course</CardTitle>
                <CardDescription>
                  Design a comprehensive learning course with AI assistance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="course-title">Course Title</Label>
                  <Input
                    id="course-title"
                    placeholder="e.g., Introduction to React Development"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course-description">Description</Label>
                  <Input
                    id="course-description"
                    placeholder="Brief description of what students will learn"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course-topics">Key Topics (comma-separated)</Label>
                  <Input
                    id="course-topics"
                    placeholder="React, Components, State Management, Hooks"
                  />
                </div>
                <Button className="w-full">Generate Course Outline</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lesson" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Lesson</CardTitle>
                <CardDescription>
                  Create an individual lesson with interactive content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="lesson-title">Lesson Title</Label>
                  <Input
                    id="lesson-title"
                    placeholder="e.g., Understanding React Components"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lesson-objective">Learning Objective</Label>
                  <Input
                    id="lesson-objective"
                    placeholder="What should students achieve after this lesson?"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lesson-duration">Estimated Duration (minutes)</Label>
                  <Input
                    id="lesson-duration"
                    type="number"
                    placeholder="30"
                  />
                </div>
                <Button className="w-full">Create Lesson</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quiz" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Quiz</CardTitle>
                <CardDescription>
                  Generate interactive quizzes to test understanding
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="quiz-title">Quiz Title</Label>
                  <Input
                    id="quiz-title"
                    placeholder="e.g., React Fundamentals Assessment"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quiz-topic">Topic/Subject</Label>
                  <Input
                    id="quiz-topic"
                    placeholder="React Components and Props"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quiz-questions">Number of Questions</Label>
                  <Input
                    id="quiz-questions"
                    type="number"
                    placeholder="10"
                  />
                </div>
                <Button className="w-full">Generate Quiz</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}