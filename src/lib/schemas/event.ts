import { z } from 'zod'

/**
 * Sport types supported in the application
 */
export const SPORT_TYPES = [
  'Soccer',
  'Basketball',
  'Tennis',
  'Baseball',
  'American Football',
  'Ice Hockey',
  'Volleyball',
  'Swimming',
  'Track and Field',
  'Golf',
  'Other',
] as const

/**
 * Venue schema
 * Validates venue information
 */
export const venueSchema = z.object({
  id: z.string().optional(),
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
    .int('Capacity must be a whole number')
    .positive('Capacity must be greater than 0')
    .optional(),
})

export type Venue = z.infer<typeof venueSchema>

/**
 * Event creation/update schema
 * Validates all event fields with sanitization
 */
export const eventSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(1, 'Event name is required')
    .max(255, 'Event name must be less than 255 characters')
    .trim(),
  sport_type: z
    .enum(SPORT_TYPES, {
      errorMap: () => ({ message: 'Please select a valid sport type' }),
    }),
  date: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), 'Please enter a valid date'),
  time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Please enter a valid time (HH:MM)'),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .trim()
    .optional(),
  venues: z
    .array(venueSchema)
    .min(1, 'At least one venue is required')
    .max(10, 'Maximum 10 venues allowed'),
})

export type EventInput = z.infer<typeof eventSchema>

/**
 * Event search/filter schema
 */
export const eventFilterSchema = z.object({
  search: z
    .string()
    .max(100, 'Search term must be less than 100 characters')
    .trim()
    .optional(),
  sport_type: z
    .enum([...SPORT_TYPES, ''])
    .optional(),
})

export type EventFilter = z.infer<typeof eventFilterSchema>
