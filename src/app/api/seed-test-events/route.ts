import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Missing Supabase credentials' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get or create test user
    const testEmail = 'test@example.com'
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', testEmail)
      .single()

    let userId = existingUser?.id

    if (!userId) {
      // Create a new user if doesn't exist
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: testEmail,
        password: 'Test@12345',
        email_confirm: true,
      })

      if (authError) {
        return NextResponse.json(
          { error: `Auth error: ${authError.message}` },
          { status: 500 }
        )
      }

      userId = authUser.user.id

      // Create user profile
      await supabase.from('users').insert({
        id: userId,
        email: testEmail,
        name: 'Test User',
      })
    }

    // Delete existing test events for this user
    await supabase.from('events').delete().eq('user_id', userId)

    // Create test venue
    const { data: venue } = await supabase
      .from('venues')
      .insert({
        name: 'Central Park',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip_code: '10001',
      })
      .select()
      .single()

    if (!venue) {
      return NextResponse.json(
        { error: 'Failed to create venue' },
        { status: 500 }
      )
    }

    // Create test events
    const events = [
      {
        name: 'Morning Soccer Match',
        sport_type: 'soccer',
        date: '2025-12-15',
        time: '09:00',
        venue_id: venue.id,
        user_id: userId,
      },
      {
        name: 'Afternoon Basketball Game',
        sport_type: 'basketball',
        date: '2025-12-16',
        time: '14:00',
        venue_id: venue.id,
        user_id: userId,
      },
      {
        name: 'Evening Tennis Tournament',
        sport_type: 'tennis',
        date: '2025-12-17',
        time: '18:00',
        venue_id: venue.id,
        user_id: userId,
      },
    ]

    const { error } = await supabase.from('events').insert(events)

    if (error) {
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Test data seeded successfully', userId },
      { status: 200 }
    )
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
