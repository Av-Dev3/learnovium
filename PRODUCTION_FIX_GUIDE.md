# 🚨 PRODUCTION FIX GUIDE

## Immediate Issues Detected

Based on your console logs from `https://www.learnovium.com/app?error=admin_required`, you're experiencing:

1. **Database Migration Not Run** - The `profiles.id` column doesn't exist
2. **Infinite Render Loop** - Fixed in code but needs deployment
3. **Multiple Supabase Client Instances** - Causing performance warnings

## 🔥 URGENT: Fix Production Database

### Step 1: Access Production Supabase

1. **Go to your Production Supabase Dashboard**
   - Visit [supabase.com](https://supabase.com)
   - Select your production project: `jjkshbnpjtjoodzqhnyb`

2. **Navigate to SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Create a new query

### Step 2: Execute the Migration

**Copy and paste this ENTIRE SQL script** into the SQL Editor:

```sql
-- Phase 7: Admin Mission Control Migration (PRODUCTION)
-- Run this in Supabase SQL Editor

-- 0. Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read/update their own profile
CREATE POLICY IF NOT EXISTS "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 1. Add is_admin column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- 2. Create reminder_settings table
CREATE TABLE IF NOT EXISTS reminder_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  enabled BOOLEAN DEFAULT TRUE,
  window_start TIME DEFAULT '09:00',
  window_end TIME DEFAULT '18:00',
  channel TEXT DEFAULT 'email' CHECK (channel IN ('email', 'push', 'both')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on reminder_settings
ALTER TABLE reminder_settings ENABLE ROW LEVEL SECURITY;

-- Allow users to read/update their own reminder settings
CREATE POLICY IF NOT EXISTS "Users can view own reminder settings" ON reminder_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own reminder settings" ON reminder_settings
  FOR ALL USING (auth.uid() = user_id);

-- 3. AI Call Log Table
CREATE TABLE IF NOT EXISTS ai_call_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_id UUID REFERENCES learning_goals(id) ON DELETE SET NULL,
  endpoint TEXT NOT NULL,
  model TEXT NOT NULL,
  prompt_tokens INTEGER DEFAULT 0,
  completion_tokens INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  cost_usd DECIMAL(10,6) DEFAULT 0,
  latency_ms INTEGER DEFAULT 0,
  success BOOLEAN DEFAULT TRUE,
  error_text TEXT
);

-- 4. Daily User Spend Rollups
CREATE TABLE IF NOT EXISTS ai_daily_user_spend (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  day DATE NOT NULL,
  total_calls INTEGER DEFAULT 0,
  success_calls INTEGER DEFAULT 0,
  error_calls INTEGER DEFAULT 0,
  total_cost_usd DECIMAL(10,6) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, day)
);

-- 5. Daily Global Spend Rollups
CREATE TABLE IF NOT EXISTS ai_daily_global_spend (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day DATE NOT NULL UNIQUE,
  total_calls INTEGER DEFAULT 0,
  success_calls INTEGER DEFAULT 0,
  error_calls INTEGER DEFAULT 0,
  total_cost_usd DECIMAL(10,6) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Admin Configuration
CREATE TABLE IF NOT EXISTS admin_config (
  id INTEGER PRIMARY KEY DEFAULT 1,
  daily_user_budget_usd DECIMAL(10,6) DEFAULT 0.25,
  daily_global_budget_usd DECIMAL(10,6) DEFAULT 10.00,
  disable_endpoints JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Insert default config
INSERT INTO admin_config (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- 7. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_call_log_created_at ON ai_call_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_call_log_user_endpoint ON ai_call_log(user_id, endpoint);
CREATE INDEX IF NOT EXISTS idx_ai_call_log_endpoint_success ON ai_call_log(endpoint, success);
CREATE INDEX IF NOT EXISTS idx_ai_daily_user_spend_day ON ai_daily_user_spend(day DESC);
CREATE INDEX IF NOT EXISTS idx_ai_daily_global_spend_day ON ai_daily_global_spend(day DESC);

-- 8. Views for reporting
CREATE OR REPLACE VIEW v_ai_spend_summary AS
SELECT 
  CURRENT_DATE as day,
  COUNT(*) as total_calls,
  COUNT(*) FILTER (WHERE success = true) as success_calls,
  COUNT(*) FILTER (WHERE success = false) as error_calls,
  SUM(cost_usd) as total_cost_usd,
  AVG(latency_ms) as avg_latency_ms
FROM ai_call_log 
WHERE created_at::DATE = CURRENT_DATE;

CREATE OR REPLACE VIEW v_top_users_today AS
SELECT 
  adus.user_id,
  u.email,
  p.is_admin,
  adus.total_calls as call_count,
  adus.total_cost_usd,
  adus.success_calls,
  adus.error_calls,
  CASE 
    WHEN adus.total_calls > 0 THEN 
      ROUND((adus.success_calls::NUMERIC / adus.total_calls * 100), 2)
    ELSE 0 
  END as success_rate
FROM ai_daily_user_spend adus
JOIN auth.users u ON adus.user_id = u.id
LEFT JOIN profiles p ON adus.user_id = p.id
WHERE adus.day = CURRENT_DATE
GROUP BY u.id, u.email, p.is_admin, adus.total_cost_usd, call_count
HAVING COUNT(acl.*) > 0
ORDER BY total_cost_usd DESC, call_count DESC
LIMIT 50;

-- 9. RPC Functions
CREATE OR REPLACE FUNCTION inc_user_spend(
  p_user_id UUID,
  p_day DATE,
  p_cost_usd DECIMAL
) RETURNS VOID AS $$
BEGIN
  INSERT INTO ai_daily_user_spend (user_id, day, total_cost_usd, total_calls)
  VALUES (p_user_id, p_day, p_cost_usd, 1)
  ON CONFLICT (user_id, day) DO UPDATE SET
    total_cost_usd = ai_daily_user_spend.total_cost_usd + p_cost_usd,
    total_calls = ai_daily_user_spend.total_calls + 1,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION inc_global_spend(
  p_day DATE,
  p_cost_usd DECIMAL
) RETURNS VOID AS $$
BEGIN
  INSERT INTO ai_daily_global_spend (day, total_cost_usd, total_calls)
  VALUES (p_day, p_cost_usd, 1)
  ON CONFLICT (day) DO UPDATE SET
    total_cost_usd = ai_daily_global_spend.total_cost_usd + p_cost_usd,
    total_calls = ai_daily_global_spend.total_calls + 1,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- 10. RLS Policies
ALTER TABLE ai_call_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_daily_user_spend ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_daily_global_spend ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_config ENABLE ROW LEVEL SECURITY;

-- Policies for admin access
CREATE POLICY IF NOT EXISTS "Admins can view all call logs" ON ai_call_log
  FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY IF NOT EXISTS "Admins can view all user spend" ON ai_daily_user_spend
  FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY IF NOT EXISTS "Admins can view global spend" ON ai_daily_global_spend
  FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY IF NOT EXISTS "All can read admin config" ON admin_config
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Admins can update admin config" ON admin_config
  FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- Service role policies for logging
CREATE POLICY IF NOT EXISTS "Service role can insert call logs" ON ai_call_log
  FOR ALL WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Service role can insert/update user spend" ON ai_daily_user_spend
  FOR ALL WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Service role can insert/update global spend" ON ai_daily_global_spend
  FOR ALL WITH CHECK (true);
```

### Step 3: Set Yourself as Admin

**After running the migration, find your user ID and set admin:**

1. **Get your user ID:**
   ```sql
   SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';
   ```

2. **Set yourself as admin:**
   ```sql
   UPDATE profiles SET is_admin = true WHERE id = 'your-user-id-here';
   ```

### Step 4: Verify Setup

```sql
-- Check if everything was created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'reminder_settings', 'ai_call_log', 'admin_config');

-- Check your admin status
SELECT id, is_admin FROM profiles WHERE id = auth.uid();
```

## 🚀 Deploy Code Fixes

After running the migration, you need to **deploy the latest code** that includes:

1. ✅ **Fixed Render Loop** - `useIsAdmin` hook now prevents infinite renders
2. ✅ **Better Error Handling** - Graceful fallbacks when database isn't ready
3. ✅ **Admin Link Logic** - Only shows when user is actually admin

## 🔍 Expected Results

After migration + deployment:

- ❌ **Before**: Infinite console logs, 400/500 errors, no admin access
- ✅ **After**: Clean console, admin link appears, `/app/admin/metrics` accessible

## 📞 Immediate Support

If you encounter any issues:

1. **Check Supabase Logs** - Look for detailed error messages
2. **Verify Migration** - Ensure all tables were created successfully
3. **Test Admin Status** - Confirm your user has `is_admin = true`
4. **Clear Browser Cache** - Force refresh after deployment

The migration is **safe and idempotent** - you can run it multiple times without issues.
