import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const supabase = await supabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's profile data
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, level, minutes_per_day, tz, avatar_url, created_at, updated_at")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }

    // Get user's auth data for email and name
    const { data: authUser } = await supabase.auth.getUser();
    const email = authUser?.user?.email || "";
    const name = authUser?.user?.user_metadata?.full_name || 
                 authUser?.user?.user_metadata?.name || 
                 email.split("@")[0] || "User";

    return NextResponse.json({
      id: profile.id,
      name,
      email,
      level: profile.level || "beginner",
      timezone: profile.tz || "UTC-5",
      avatarUrl: profile.avatar_url || "",
      minutesPerDay: profile.minutes_per_day || 30,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at
    });
  } catch (error) {
    console.error("Unexpected error in profiles GET:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const supabase = await supabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { level, timezone, minutesPerDay, avatarUrl } = body;

    // Validate input
    const updates: Record<string, unknown> = {};
    
    if (level && ["beginner", "intermediate", "advanced"].includes(level)) {
      updates.level = level;
    }
    
    if (timezone && typeof timezone === "string") {
      updates.tz = timezone;
    }
    
    if (minutesPerDay && typeof minutesPerDay === "number" && minutesPerDay > 0) {
      updates.minutes_per_day = minutesPerDay;
    }
    
    if (avatarUrl !== undefined) {
      updates.avatar_url = avatarUrl;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid updates provided" }, { status: 400 });
    }

    updates.updated_at = new Date().toISOString();

    // Update profile
    const { data: updatedProfile, error: updateError } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating profile:", updateError);
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      profile: updatedProfile
    });
  } catch (error) {
    console.error("Unexpected error in profiles PUT:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
