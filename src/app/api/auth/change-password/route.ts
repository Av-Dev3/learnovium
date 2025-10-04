import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const supabase = await supabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();
    
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ 
        error: "Current password and new password are required" 
      }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ 
        error: "New password must be at least 8 characters long" 
      }, { status: 400 });
    }

    // Verify current password by attempting to sign in
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword
    });

    if (verifyError) {
      return NextResponse.json({ 
        error: "Current password is incorrect" 
      }, { status: 400 });
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) {
      console.error("Error updating password:", updateError);
      return NextResponse.json({ 
        error: "Failed to update password" 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Password updated successfully" 
    });
  } catch (error) {
    console.error("Unexpected error in change-password:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}
