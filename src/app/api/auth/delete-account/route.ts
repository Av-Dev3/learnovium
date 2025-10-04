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

    const { password, confirmDelete } = await req.json();
    
    if (!password) {
      return NextResponse.json({ 
        error: "Password is required to delete account" 
      }, { status: 400 });
    }

    if (confirmDelete !== "DELETE") {
      return NextResponse.json({ 
        error: "Please type 'DELETE' to confirm account deletion" 
      }, { status: 400 });
    }

    // Verify password by attempting to sign in
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: password
    });

    if (verifyError) {
      return NextResponse.json({ 
        error: "Password is incorrect" 
      }, { status: 400 });
    }

    // Delete user data from profiles table first
    const { error: profileError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", user.id);

    if (profileError) {
      console.error("Error deleting profile:", profileError);
      return NextResponse.json({ 
        error: "Failed to delete profile data" 
      }, { status: 500 });
    }

    // Delete reminder settings
    const { error: reminderError } = await supabase
      .from("reminder_settings")
      .delete()
      .eq("user_id", user.id);

    if (reminderError) {
      console.error("Error deleting reminder settings:", reminderError);
      // Continue with deletion even if this fails
    }

    // Note: Supabase doesn't provide a direct way to delete the auth user
    // This would typically be done through the Supabase admin API
    // For now, we'll just delete the profile data and sign out the user
    
    // Sign out the user
    await supabase.auth.signOut();

    return NextResponse.json({ 
      success: true, 
      message: "Account data deleted successfully. Please contact support to complete account deletion." 
    });
  } catch (error) {
    console.error("Unexpected error in delete-account:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}
