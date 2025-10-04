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

    // Disconnect calendar by updating settings
    const { error: updateError } = await supabase
      .from("calendar_settings")
      .update({
        is_connected: false,
        calendar_id: "",
        updated_at: new Date().toISOString()
      })
      .eq("user_id", user.id);

    if (updateError) {
      console.error("Error disconnecting calendar:", updateError);
      return NextResponse.json({ 
        error: "Failed to disconnect calendar" 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Calendar disconnected successfully" 
    });
  } catch (error) {
    console.error("Unexpected error in calendar disconnect:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}
