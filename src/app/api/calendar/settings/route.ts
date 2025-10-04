import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await supabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get calendar settings from database
    const { data: settings, error: settingsError } = await supabase
      .from("calendar_settings")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (settingsError && settingsError.code !== 'PGRST116') {
      console.error("Error fetching calendar settings:", settingsError);
      return NextResponse.json({ 
        error: "Failed to fetch calendar settings" 
      }, { status: 500 });
    }

    // Return default settings if none exist
    const defaultSettings = {
      isConnected: false,
      calendarId: "",
      syncLessons: true,
      syncReminders: true,
      syncDeadlines: true,
      syncFrequency: "realtime",
      eventColor: "#8B5CF6",
      reminderTime: 15
    };

    return NextResponse.json(settings || defaultSettings);
  } catch (error) {
    console.error("Unexpected error in calendar settings GET:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await supabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await req.json();

    // Upsert calendar settings
    const { error: upsertError } = await supabase
      .from("calendar_settings")
      .upsert({
        user_id: user.id,
        is_connected: settings.isConnected,
        calendar_id: settings.calendarId,
        sync_lessons: settings.syncLessons,
        sync_reminders: settings.syncReminders,
        sync_deadlines: settings.syncDeadlines,
        sync_frequency: settings.syncFrequency,
        event_color: settings.eventColor,
        reminder_time: settings.reminderTime,
        updated_at: new Date().toISOString()
      });

    if (upsertError) {
      console.error("Error saving calendar settings:", upsertError);
      return NextResponse.json({ 
        error: "Failed to save calendar settings" 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Calendar settings saved successfully" 
    });
  } catch (error) {
    console.error("Unexpected error in calendar settings POST:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}
