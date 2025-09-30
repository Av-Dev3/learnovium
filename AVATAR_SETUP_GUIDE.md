# Avatar Upload Setup Guide

## 🚨 Current Issue
The avatar upload is failing with a 500 error because the required Supabase Storage bucket doesn't exist yet.

## 🔧 Solution: Create Storage Bucket

### Step 1: Access Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **"New bucket"**

### Step 2: Create the Avatars Bucket
Configure the bucket with these settings:

- **Name**: `avatars`
- **Public**: ✅ **Yes** (checked)
- **File size limit**: `5 MB`
- **Allowed MIME types**: `image/*`

### Step 3: Set Bucket Policies
After creating the bucket, you need to set up Row Level Security (RLS) policies:

1. Go to **Storage** → **Policies** → **avatars**
2. Click **"New Policy"**
3. Create these policies:

#### Policy 1: Allow authenticated users to upload
- **Policy name**: `Allow authenticated users to upload avatars`
- **Target roles**: `authenticated`
- **Policy definition**:
```sql
((bucket_id = 'avatars'::text) AND (auth.role() = 'authenticated'::text))
```

#### Policy 2: Allow public access to view avatars
- **Policy name**: `Allow public access to view avatars`
- **Target roles**: `public`
- **Policy definition**:
```sql
((bucket_id = 'avatars'::text))
```

### Step 4: Run Database Migration
Make sure the `avatar_url` column exists in the profiles table:

1. Go to **SQL Editor** in Supabase
2. Run this migration:

```sql
-- Add avatar_url column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.avatar_url IS 'URL of the user profile picture stored in Supabase Storage';
```

## ✅ Verification
After completing these steps:
1. Try uploading a profile picture in the settings page
2. The upload should work without errors
3. The image should be visible in your profile

## 🔍 Troubleshooting
If you still get errors:
1. Check the browser console for specific error messages
2. Verify the bucket name is exactly `avatars` (case-sensitive)
3. Ensure the bucket is set to public
4. Check that the RLS policies are correctly configured
