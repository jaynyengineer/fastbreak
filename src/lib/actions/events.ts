/**
 * Server Actions for event management
 * All database operations happen server-side with proper authorization checks
 */

'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { executeAction, type ActionResponse } from '@/lib/action-response'
import {
  createEventSchema,
  updateEventSchema,
  type CreateEventInput,
  type UpdateEventInput,
  type EventWithVenues,
} from '@/lib/schemas/events'

/**
 * Create a new event with venues
 */
export async function createEventAction(
  input: CreateEventInput
): Promise<ActionResponse<{ event_id: string }>> {
  return executeAction(async () => {
    const supabase = await createServerSupabaseClient()

    // Validate input
    const validatedInput = createEventSchema.parse(input)

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    // Start transaction: create event
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .insert({
        user_id: user.id,
        name: validatedInput.name,
        sport_type: validatedInput.sport_type,
        date: validatedInput.date,
        time: validatedInput.time,
        description: validatedInput.description,
      })
      .select()
      .single()

    if (eventError) throw new Error(eventError.message || 'Failed to create event')
    if (!eventData) throw new Error('Failed to create event')

    // Create venues for the event
    if (validatedInput.venues && validatedInput.venues.length > 0) {
      const venuesWithEventId = validatedInput.venues.map((venue) => ({
        event_id: eventData.id,
        name: venue.name,
        address: venue.address,
        capacity: venue.capacity,
      }))

      const { error: venuesError } = await supabase
        .from('venues')
        .insert(venuesWithEventId)

      if (venuesError) {
        throw new Error(venuesError.message || 'Failed to create venues')
      }
    }

    return { event_id: eventData.id }
  })
}

/**
 * Get all events
 */
export async function getEventsAction(): Promise<
  ActionResponse<EventWithVenues[]>
> {
  return executeAction(async () => {
    const supabase = await createServerSupabaseClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    // Fetch all events with their venues
    const { data: events, error } = await supabase
      .from('events')
      .select(
        `
        id,
        user_id,
        name,
        sport_type,
        date,
        time,
        description,
        created_at,
        updated_at,
        venues (
          id,
          name,
          address,
          capacity,
          created_at
        )
      `
      )
      .order('date', { ascending: false })

    if (error) throw new Error(error.message || 'Failed to fetch events')
    if (!events) throw new Error('Failed to fetch events')

    return events as EventWithVenues[]
  })
}

/**
 * Get a single event by ID with ownership verification
 */
export async function getEventByIdAction(
  eventId: string
): Promise<ActionResponse<EventWithVenues>> {
  return executeAction(async () => {
    const supabase = await createServerSupabaseClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    // Fetch event with venues
    const { data: event, error } = await supabase
      .from('events')
      .select(
        `
        id,
        user_id,
        name,
        sport_type,
        date,
        time,
        description,
        created_at,
        updated_at,
        venues (
          id,
          name,
          address,
          capacity,
          created_at
        )
      `
      )
      .eq('id', eventId)
      .single()

    if (error) throw new Error('Event not found')
    if (!event) throw new Error('Event not found')

    // Verify ownership
    if (event.user_id !== user.id) {
      throw new Error('Unauthorized: You do not own this event')
    }

    return event as EventWithVenues
  })
}

/**
 * Update an event (ownership verified)
 */
export async function updateEventAction(
  eventId: string,
  input: UpdateEventInput
): Promise<ActionResponse<{ success: boolean }>> {
  return executeAction(async () => {
    const supabase = await createServerSupabaseClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    // Verify ownership - fetch event first
    const { data: existingEvent, error: fetchError } = await supabase
      .from('events')
      .select('user_id')
      .eq('id', eventId)
      .single()

    if (fetchError || !existingEvent) throw new Error('Event not found')
    if (existingEvent.user_id !== user.id) {
      throw new Error('Unauthorized: You do not own this event')
    }

    // Validate input (partial update allowed)
    const validatedInput = updateEventSchema.parse(input)

    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {}
    if (validatedInput.name !== undefined) updateData.name = validatedInput.name
    if (validatedInput.sport_type !== undefined)
      updateData.sport_type = validatedInput.sport_type
    if (validatedInput.date !== undefined) updateData.date = validatedInput.date
    if (validatedInput.time !== undefined) updateData.time = validatedInput.time
    if (validatedInput.description !== undefined)
      updateData.description = validatedInput.description
    updateData.updated_at = new Date().toISOString()

    // Update event
    const { error: updateError } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', eventId)

    if (updateError) throw new Error(updateError.message || 'Failed to update event')

    // Handle venues update if provided
    if (validatedInput.venues && validatedInput.venues.length > 0) {
      // Delete existing venues
      await supabase.from('venues').delete().eq('event_id', eventId)

      // Insert new venues
      const venuesWithEventId = validatedInput.venues.map((venue) => ({
        event_id: eventId,
        name: venue.name,
        address: venue.address,
        capacity: venue.capacity,
      }))

      const { error: venuesError } = await supabase
        .from('venues')
        .insert(venuesWithEventId)

      if (venuesError) throw new Error(venuesError.message || 'Failed to update venues')
    }

    return { success: true }
  })
}

/**
 * Delete an event (ownership verified)
 */
export async function deleteEventAction(
  eventId: string
): Promise<ActionResponse<{ success: boolean }>> {
  return executeAction(async () => {
    const supabase = await createServerSupabaseClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    // Verify ownership - fetch event first
    const { data: existingEvent, error: fetchError } = await supabase
      .from('events')
      .select('user_id')
      .eq('id', eventId)
      .single()

    if (fetchError || !existingEvent) throw new Error('Event not found')
    if (existingEvent.user_id !== user.id) {
      throw new Error('Unauthorized: You do not own this event')
    }

    // Delete event (venues will cascade delete due to foreign key)
    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId)

    if (deleteError) throw new Error(deleteError.message || 'Failed to delete event')

    return { success: true }
  })
}
