import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await supabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user profile data
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return NextResponse.json({ 
        error: "Failed to fetch profile data" 
      }, { status: 500 });
    }

    // Get reminder settings
    const { data: reminders } = await supabase
      .from("reminder_settings")
      .select("*")
      .eq("user_id", user.id)
      .single();

    // Get user's auth data
    const { data: authUser } = await supabase.auth.getUser();
    
    // Compile all user data
    const userData = {
      exportDate: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
        name: authUser?.user?.user_metadata?.full_name || 
              authUser?.user?.user_metadata?.name || 
              user.email?.split("@")[0] || "User",
        createdAt: user.created_at,
        lastSignIn: user.last_sign_in_at
      },
      profile: profile || {},
      reminders: reminders || {},
      metadata: {
        exportedBy: "Learnovium Data Export",
        version: "1.0"
      }
    };

    // Return as JSON (in a real app, you might want to generate a downloadable file)
    return NextResponse.json(userData, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="learnovium-data-export-${new Date().toISOString().split('T')[0]}.json"`
      }
    });
  } catch (error) {
    console.error("Unexpected error in export-data:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}
