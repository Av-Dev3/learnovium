# Database Setup Guide

## 🚨 Current Issues Detected

Based on the console errors, the following database issues need to be resolved:

### 1. Missing Tables
- `profiles` table doesn't exist or is missing the `is_admin` column
- `reminder_settings` table doesn't exist
- Admin tables from Phase 7 haven't been created

### 2. Console Errors
```
- 400 error on profiles query for admin status check
- 500 error on reminders API (missing reminder_settings table)
- 404 error on /api/goals (should work after migration)
```

## 🔧 Solution: Run the Migration

### Step 1: Access Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Create a new query

### Step 2: Run the Complete Migration

Copy and paste the entire contents of `migrations/20241215_admin_mission_control.sql` into the SQL Editor and run it.

**Key tables that will be created:**
- ✅ `profiles` (with `is_admin` column)
- ✅ `reminder_settings` (for user notification preferences)
- ✅ `ai_call_log` (for admin observability)
- ✅ `ai_daily_user_spend` (for budget tracking)
- ✅ `ai_daily_global_spend` (for global limits)
- ✅ `admin_config` (for admin settings)

### Step 3: Set Your User as Admin

After running the migration, you need to set your user as an admin:

1. **Find your user ID:**
   - Go to Supabase → Authentication → Users
   - Copy your user ID

2. **Run this SQL command:**
   ```sql
   UPDATE profiles SET is_admin = true WHERE id = 'your-user-id-here';
   ```
   
   Replace `'your-user-id-here'` with your actual user ID.

### Step 4: Verify the Setup

Run these verification queries:

```sql
-- Check if profiles table exists with is_admin column
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles';

-- Check if reminder_settings table exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'reminder_settings';

-- Check admin config
SELECT * FROM admin_config;

-- Check your admin status
SELECT id, is_admin FROM profiles WHERE id = auth.uid();
```

## 🎯 Expected Results After Migration

### ✅ Fixed Issues
1. **Admin Link Visibility**: The "Admin" link will appear in navigation for admin users
2. **Profiles API**: `/api/admin/*` endpoints will work properly
3. **Reminders API**: Settings page will load without errors
4. **Goals API**: All goal-related endpoints will function correctly

### ✅ New Functionality
1. **Admin Dashboard**: Access `/app/admin/metrics` as an admin user
2. **AI Observability**: All AI calls will be logged and tracked
3. **Budget Controls**: Daily spending limits will be enforced
4. **Cost Monitoring**: Real-time cost and usage analytics

## 🔍 Troubleshooting

### If you still see errors after migration:

1. **Clear browser cache and reload**
2. **Check browser console** for any remaining errors
3. **Verify environment variables** are set correctly:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

### If admin link doesn't appear:
1. Verify your user has `is_admin = true` in the profiles table
2. Check browser network tab for any failed API calls
3. Ensure you're logged in with the correct user account

## 📞 Support

If you encounter any issues:
1. Check the Supabase logs for detailed error messages
2. Verify all tables were created successfully
3. Ensure RLS policies are working correctly
4. Test with a fresh browser session

The migration is designed to be safe and idempotent - you can run it multiple times without issues.
