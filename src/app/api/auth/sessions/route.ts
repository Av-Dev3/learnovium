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

    // Get user sessions (this is a simplified version - Supabase doesn't expose all sessions)
    const { data: sessionData } = await supabase.auth.getSession();
    
    return NextResponse.json({
      currentSession: sessionData.session ? {
        id: sessionData.session.access_token,
        createdAt: new Date().toISOString(), // Use current time as fallback
        expiresAt: new Date((sessionData.session.expires_at || 0) * 1000).toISOString(),
        userAgent: req.headers.get('user-agent') || 'Unknown',
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'Unknown'
      } : null
    });
  } catch (error) {
    console.error("Unexpected error in sessions GET:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await supabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Sign out the user (this will invalidate the current session)
    const { error: signOutError } = await supabase.auth.signOut();
    
    if (signOutError) {
      console.error("Error signing out:", signOutError);
      return NextResponse.json({ 
        error: "Failed to sign out" 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Signed out successfully" 
    });
  } catch (error) {
    console.error("Unexpected error in sessions DELETE:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}
