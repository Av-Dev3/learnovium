import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/goals/popular
 * Returns the most popular goals/plans based on creation frequency
 */
export async function GET() {
  try {
    console.log("GET /api/goals/popular - starting");
    
    // For now, return mock data to test the frontend
    const mockPopularGoals = [
      {
        topic: "JavaScript",
        focus: "React Development",
        level: "intermediate",
        count: 15,
        recent_created_at: new Date().toISOString()
      },
      {
        topic: "Python",
        focus: "Data Science",
        level: "beginner",
        count: 12,
        recent_created_at: new Date(Date.now() - 86400000).toISOString()
      },
      {
        topic: "Machine Learning",
        focus: "Deep Learning",
        level: "advanced",
        count: 8,
        recent_created_at: new Date(Date.now() - 172800000).toISOString()
      },
      {
        topic: "Web Design",
        focus: "UI/UX",
        level: "beginner",
        count: 7,
        recent_created_at: new Date(Date.now() - 259200000).toISOString()
      },
      {
        topic: "Database Management",
        focus: "SQL",
        level: "intermediate",
        count: 6,
        recent_created_at: new Date(Date.now() - 345600000).toISOString()
      },
      {
        topic: "Mobile Development",
        focus: "React Native",
        level: "intermediate",
        count: 5,
        recent_created_at: new Date(Date.now() - 432000000).toISOString()
      }
    ];

    console.log("GET /api/goals/popular - returning mock data:", mockPopularGoals);
    return NextResponse.json(mockPopularGoals);

  } catch (error) {
    console.error("GET /api/goals/popular - unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
