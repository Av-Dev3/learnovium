import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const supabase = await supabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get calendar settings
    const { data: settings, error: settingsError } = await supabase
      .from("calendar_settings")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (settingsError || !settings?.is_connected) {
      return NextResponse.json({ 
        error: "Calendar not connected" 
      }, { status: 400 });
    }

    // In a real implementation, this would sync with Google Calendar API
    // For now, we'll simulate the sync process
    console.log("Syncing calendar for user:", user.id);
    console.log("Settings:", settings);

    // Simulate sync delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({ 
      success: true, 
      message: "Calendar synced successfully",
      syncedEvents: 0 // In real implementation, return actual count
    });
  } catch (error) {
    console.error("Unexpected error in calendar sync:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}
