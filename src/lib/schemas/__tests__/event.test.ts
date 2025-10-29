import { eventSchema, venueSchema, eventFilterSchema } from '../event'

describe('Event Schemas', () => {
  describe('venueSchema', () => {
    it('should accept valid venue', () => {
      const result = venueSchema.parse({
        name: 'Central Stadium',
        address: '123 Main St',
        capacity: 5000,
      })
      expect(result.name).toBe('Central Stadium')
      expect(result.address).toBe('123 Main St')
      expect(result.capacity).toBe(5000)
    })

    it('should reject missing required fields', () => {
      expect(() => venueSchema.parse({ address: '123 Main St' })).toThrow()
      expect(() => venueSchema.parse({ name: 'Stadium' })).toThrow()
    })

    it('should reject name exceeding max length', () => {
      expect(() =>
        venueSchema.parse({
          name: 'a'.repeat(256),
          address: '123 Main St',
        })
      ).toThrow()
    })

    it('should trim whitespace from name and address', () => {
      const result = venueSchema.parse({
        name: '  Stadium  ',
        address: '  123 Main St  ',
      })
      expect(result.name).toBe('Stadium')
      expect(result.address).toBe('123 Main St')
    })
  })

  describe('eventSchema', () => {
    const validEvent = {
      name: 'Championship Game',
      sport_type: 'Soccer' as const,
      date: '2025-11-15',
      time: '14:00',
      description: 'Final championship game',
      venues: [
        {
          name: 'Central Stadium',
          address: '123 Main St',
          capacity: 5000,
        },
      ],
    }

    it('should accept valid event', () => {
      const result = eventSchema.parse(validEvent)
      expect(result.name).toBe('Championship Game')
      expect(result.sport_type).toBe('Soccer')
    })

    it('should reject missing required fields', () => {
      expect(() =>
        eventSchema.parse({
          ...validEvent,
          name: '',
        })
      ).toThrow()
    })

    it('should reject invalid sport type', () => {
      expect(() =>
        eventSchema.parse({
          ...validEvent,
          sport_type: 'InvalidSport',
        })
      ).toThrow()
    })

    it('should reject invalid date', () => {
      expect(() =>
        eventSchema.parse({
          ...validEvent,
          date: 'invalid-date',
        })
      ).toThrow()
    })

    it('should reject invalid time format', () => {
      expect(() =>
        eventSchema.parse({
          ...validEvent,
          time: '2500',
        })
      ).toThrow()
    })

    it('should require at least one venue', () => {
      expect(() =>
        eventSchema.parse({
          ...validEvent,
          venues: [],
        })
      ).toThrow()
    })

    it('should reject more than 10 venues', () => {
      const manyVenues = Array.from({ length: 11 }, (_, i) => ({
        name: `Venue ${i}`,
        address: `${i} Street`,
        capacity: 1000,
      }))

      expect(() =>
        eventSchema.parse({
          ...validEvent,
          venues: manyVenues,
        })
      ).toThrow()
    })
  })

  describe('eventFilterSchema', () => {
    it('should accept empty filter', () => {
      const result = eventFilterSchema.parse({})
      expect(result.search).toBeUndefined()
      expect(result.sport_type).toBeUndefined()
    })

    it('should accept search term', () => {
      const result = eventFilterSchema.parse({ search: 'championship' })
      expect(result.search).toBe('championship')
    })

    it('should accept valid sport type', () => {
      const result = eventFilterSchema.parse({ sport_type: 'Soccer' })
      expect(result.sport_type).toBe('Soccer')
    })

    it('should reject search exceeding max length', () => {
      expect(() =>
        eventFilterSchema.parse({ search: 'a'.repeat(101) })
      ).toThrow()
    })
  })
})
