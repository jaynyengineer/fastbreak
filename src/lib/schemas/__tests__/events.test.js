import { createEventSchema } from '../events'

describe('createEventSchema', () => {
  const base = {
    name: 'Test Event',
    sport_type: 'Other',
    date: '2025-10-30',
    time: '12:30',
    description: '',
    venues: [{ name: 'A', address: '123', capacity: 100 }],
  }

  it('coerces capacity from string', () => {
    const parsed = createEventSchema.parse({
      ...base,
      venues: [{ name: 'A', address: '123', capacity: '250' }],
    })
    expect(parsed.venues[0].capacity).toBe(250)
  })

  it('rejects capacity < 1', () => {
    expect(() =>
      createEventSchema.parse({
        ...base,
        venues: [{ name: 'A', address: '123', capacity: 0 }],
      })
    ).toThrow()
  })

  it('rejects invalid sport type', () => {
    expect(() =>
      createEventSchema.parse({
        ...base,
        sport_type: 'Swimming',
      })
    ).toThrow()
  })

  it('rejects invalid time format', () => {
    expect(() =>
      createEventSchema.parse({
        ...base,
        time: '9:5',
      })
    ).toThrow()
  })

  it('rejects invalid date string', () => {
    expect(() =>
      createEventSchema.parse({
        ...base,
        date: 'not-a-date',
      })
    ).toThrow()
  })

  it('enforces at least one venue and max 10 venues', () => {
    expect(() =>
      createEventSchema.parse({
        ...base,
        venues: [],
      })
    ).toThrow()

    const many = Array.from({ length: 11 }, (_, i) => ({ name: `V${i}`, address: 'A', capacity: 1 }))
    expect(() =>
      createEventSchema.parse({
        ...base,
        venues: many,
      })
    ).toThrow()
  })
})
