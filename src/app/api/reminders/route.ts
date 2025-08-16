import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function GET() {
  try {
    const supabase = await supabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's reminder settings
    const { data: reminders, error } = await supabase
      .from('reminder_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching reminder settings:', error);
      return NextResponse.json({ error: 'Failed to fetch reminder settings' }, { status: 500 });
    }

    // Return default settings if none exist
    const defaultSettings = {
      enabled: true,
      window_start: '09:00',
      window_end: '18:00',
      channel: 'email' as const,
      user_id: user.id
    };

    return NextResponse.json(reminders || defaultSettings);
  } catch (error) {
    console.error('Unexpected error in reminders GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await supabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { enabled, window_start, window_end, channel } = body;

    // Validate input
    if (typeof enabled !== 'boolean') {
      return NextResponse.json({ error: 'Invalid enabled value' }, { status: 400 });
    }

    if (typeof window_start !== 'string' || typeof window_end !== 'string') {
      return NextResponse.json({ error: 'Invalid time window values' }, { status: 400 });
    }

    if (!['email', 'push', 'both'].includes(channel)) {
      return NextResponse.json({ error: 'Invalid channel value' }, { status: 400 });
    }

    // Upsert reminder settings
    const { data, error } = await supabase
      .from('reminder_settings')
      .upsert({
        user_id: user.id,
        enabled,
        window_start,
        window_end,
        channel,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving reminder settings:', error);
      return NextResponse.json({ error: 'Failed to save reminder settings' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error in reminders POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 