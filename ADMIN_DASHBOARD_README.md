# Admin Dashboard - Client-Only Implementation

This admin dashboard provides real-time monitoring of AI service usage, costs, and system health without requiring Next.js API routes.

## Features

- **Real-time Metrics**: Auto-refreshes every 10 seconds
- **Cost Monitoring**: Track daily spend across all AI endpoints
- **User Analytics**: See top users by cost and usage
- **Error Tracking**: Monitor failed API calls and latency
- **CSV Export**: Download data for external analysis
- **Live Controls**: Update budget limits and disable endpoints
- **Responsive Charts**: Beautiful visualizations using Recharts

## Security

- **Server-side Gating**: Uses `@supabase/ssr` to verify admin status
- **RLS Protection**: All database queries protected by Row Level Security
- **Admin-only Access**: Requires `profiles.is_admin = true`

## Database Schema

The dashboard expects these tables/views (already created by migration):

- `v_ai_spend_summary` - Daily spend summary
- `v_top_users_today` - Top users by cost today
- `ai_call_log` - Individual API call logs
- `admin_config` - System configuration

## Usage

### 1. Access the Dashboard

Navigate to `/admin/metrics` - only accessible to admin users.

### 2. Key Metrics Displayed

- **Today's Global Spend**: Total cost across all endpoints
- **Success/Error Calls**: API call success rates
- **Endpoint Breakdown**: Cost and call volume by service
- **Live Spend Chart**: Per-minute cost and error tracking
- **Top Users**: Highest-spending users today
- **Recent Logs**: Latest 300 API calls with details

### 3. Controls

- **Daily User Budget**: Per-user spending limit
- **Daily Global Budget**: Total platform spending limit  
- **Disable Endpoints**: Comma-separated list of services to disable

### 4. Data Export

- **Top Users CSV**: Download user spending data
- **Recent Logs CSV**: Download detailed call logs

## Technical Implementation

### Architecture

```
/admin/metrics/page.tsx (Server Component - Auth Gate)
    ↓
MetricsClient.tsx (Client Component - Dashboard)
    ↓
supabaseBrowser() (Direct Supabase Client)
    ↓
Database Tables/Views (Protected by RLS)
```

### Key Components

- **Server Gate**: Verifies admin status using Supabase SSR
- **Client Dashboard**: Handles all data fetching and UI
- **Singleton Client**: `supabaseBrowser()` provides consistent connection
- **Real-time Updates**: 10-second polling with cleanup

### Dependencies

- `@supabase/ssr` - Server-side authentication
- `recharts` - Chart visualizations  
- `@/components/ui/*` - shadcn/ui components
- Tailwind CSS - Styling

## Setup Requirements

1. **Database Migration**: Run `migrations/20241215_admin_mission_control.sql`
2. **Admin User**: Set `is_admin = true` for your user in `profiles` table
3. **Environment Variables**: Ensure Supabase URL and keys are configured
4. **RLS Policies**: Verify admin policies are active on tables

## Performance

- **Efficient Queries**: Uses database views and indexes
- **Client-side Caching**: Minimal server load
- **Smart Polling**: Only refreshes when needed
- **Optimized Charts**: Responsive containers with proper sizing

## Troubleshooting

### Common Issues

1. **Access Denied**: Check `profiles.is_admin` flag
2. **No Data**: Verify database views exist and have data
3. **Charts Not Loading**: Check Recharts installation
4. **RLS Errors**: Ensure admin policies are active

### Debug Mode

Check browser console for:
- Supabase connection errors
- RLS policy violations  
- Chart rendering issues

## Future Enhancements

- **Real-time WebSockets**: Replace polling with live updates
- **Advanced Filtering**: Date ranges, user selection
- **Alert System**: Budget threshold notifications
- **Performance Metrics**: Response time analytics
- **Cost Forecasting**: Predictive spending analysis
