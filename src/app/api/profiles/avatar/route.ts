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

    const formData = await req.formData();
    const file = formData.get("avatar") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 });
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Upload to Supabase Storage
    console.log("Attempting to upload to bucket 'avatars' with path:", filePath);
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false
      });

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      
      // Check if it's a bucket not found error
      if (uploadError.message?.includes("Bucket not found") || uploadError.message?.includes("not found")) {
        return NextResponse.json({ 
          error: "Storage bucket 'avatars' not found. Please create it in Supabase Storage settings." 
        }, { status: 500 });
      }
      
      return NextResponse.json({ 
        error: `Failed to upload file: ${uploadError.message}` 
      }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    // Update profile with new avatar URL
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ 
        avatar_url: publicUrl,
        updated_at: new Date().toISOString()
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating profile:", updateError);
      // Try to clean up uploaded file
      await supabase.storage.from("avatars").remove([filePath]);
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }

    return NextResponse.json({
      message: "Avatar uploaded successfully",
      avatarUrl: publicUrl
    });
  } catch (error) {
    console.error("Unexpected error in avatar upload:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await supabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current avatar URL
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }

    // Remove avatar URL from profile
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ 
        avatar_url: null,
        updated_at: new Date().toISOString()
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating profile:", updateError);
      return NextResponse.json({ error: "Failed to remove avatar" }, { status: 500 });
    }

    // Try to delete the file from storage (optional, don't fail if this doesn't work)
    if (profile.avatar_url) {
      try {
        const urlParts = profile.avatar_url.split("/");
        const fileName = urlParts[urlParts.length - 1];
        await supabase.storage.from("avatars").remove([`avatars/${fileName}`]);
      } catch (deleteError) {
        console.warn("Could not delete old avatar file:", deleteError);
        // Don't fail the request if file deletion fails
      }
    }

    return NextResponse.json({
      message: "Avatar removed successfully"
    });
  } catch (error) {
    console.error("Unexpected error in avatar deletion:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
