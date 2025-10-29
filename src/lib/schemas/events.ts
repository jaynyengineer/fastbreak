import { z } from 'zod'

/**
 * Venue schema for event creation/updates
 */
export const venueSchema = z.object({
  name: z
    .string()
    .min(1, 'Venue name is required')
    .max(255, 'Venue name must be less than 255 characters')
    .trim(),
  address: z
    .string()
    .min(1, 'Address is required')
    .max(500, 'Address must be less than 500 characters')
    .trim(),
  capacity: z
    .number()
    .min(1, 'Capacity must be at least 1')
    .max(1000000, 'Capacity must be less than 1,000,000'),
})

export type Venue = z.infer<typeof venueSchema>

/**
 * Sport types available for events
 */
export const SPORT_TYPES = [
  'Soccer',
  'Basketball',
  'Tennis',
  'Baseball',
  'Football',
  'Volleyball',
  'Hockey',
  'Golf',
  'Cricket',
  'Rugby',
  'Other',
] as const

/**
 * Event creation schema
 */
export const createEventSchema = z.object({
  name: z
    .string()
    .min(1, 'Event name is required')
    .max(255, 'Event name must be less than 255 characters')
    .trim(),
  sport_type: z.enum(SPORT_TYPES),
  date: z
    .string()
    .refine(
      (val) => !isNaN(Date.parse(val)),
      'Invalid date format'
    ),
  time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional()
    .default(''),
  venues: z
    .array(venueSchema)
    .min(1, 'At least one venue is required')
    .max(10, 'Maximum 10 venues per event'),
})

export type CreateEventInput = z.infer<typeof createEventSchema>

/**
 * Event update schema (all fields optional)
 */
export const updateEventSchema = createEventSchema.partial()

export type UpdateEventInput = z.infer<typeof updateEventSchema>

/**
 * Event filter schema for dashboard queries
 */
export const eventFilterSchema = z.object({
  sport_type: z.string().optional(),
  search: z.string().max(255).optional(),
})

export type EventFilter = z.infer<typeof eventFilterSchema>

/**
 * Event response schema (from database)
 */
export const eventResponseSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  name: z.string(),
  sport_type: z.string(),
  date: z.string(),
  time: z.string(),
  description: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type EventResponse = z.infer<typeof eventResponseSchema>

/**
 * Event with venues response schema
 */
export const eventWithVenuesSchema = eventResponseSchema.extend({
  venues: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
      address: z.string(),
      capacity: z.number(),
      created_at: z.string(),
    })
  ),
})

export type EventWithVenues = z.infer<typeof eventWithVenuesSchema>
