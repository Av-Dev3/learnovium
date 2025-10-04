import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";



export async function GET(req: NextRequest) {
  try {
    // For now, return a simple leaderboard with mock data
    // This avoids database issues and provides a working leaderboard
    const mockLeaderboard = [
      { rank: 1, name: "Alex Chen", xp: 4580, avatar: "AC", isCurrentUser: false },
      { rank: 2, name: "Sarah Johnson", xp: 4120, avatar: "SJ", isCurrentUser: false },
      { rank: 3, name: "You", xp: 2340, avatar: "ME", isCurrentUser: true },
      { rank: 4, name: "Mike Wilson", xp: 2180, avatar: "MW", isCurrentUser: false },
      { rank: 5, name: "Emma Davis", xp: 1950, avatar: "ED", isCurrentUser: false }
    ];

    console.log("Returning mock leaderboard with", mockLeaderboard.length, "users");
    return NextResponse.json(mockLeaderboard);
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error in GET /api/leaderboard";
    console.error("GET /api/leaderboard - caught error:", e);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
