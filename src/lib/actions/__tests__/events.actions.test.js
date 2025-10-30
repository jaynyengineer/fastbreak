import {
  createEventAction,
  getEventsAction,
  getEventByIdAction,
  getEventByIdWithOwnershipAction,
  updateEventAction,
  deleteEventAction,
} from '@/lib/actions/events'

import { createServerSupabaseClient } from '@/lib/supabase/server'

jest.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: jest.fn(),
}))

const mockedCreateServer = createServerSupabaseClient

function authUser(id = 'user-1') {
  return {
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: { id } } }),
    },
  }
}

describe('events server actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('createEventAction: creates event and venues for authenticated user', async () => {
    const eventId = 'evt-1'
    const supabase = {
      ...authUser('user-1'),
      from: jest.fn((table) => {
        if (table === 'events') {
          return {
            insert: jest.fn(() => ({
              select: () => ({
                single: () => Promise.resolve({ data: { id: eventId }, error: null }),
              }),
            })),
          }
        }
        if (table === 'venues') {
          return {
            insert: jest.fn(() => Promise.resolve({ error: null })),
          }
        }
        throw new Error('Unknown table ' + table)
      }),
    }

    mockedCreateServer.mockResolvedValue(supabase)

    const res = await createEventAction({
      name: 'Pickup Game',
      sport_type: 'Basketball',
      date: '2025-01-01',
      time: '10:30',
      description: 'Open to all',
      venues: [{ name: 'Gym A', address: '123 St', capacity: 10 }],
    })

    expect(res).toEqual({ success: true, data: { event_id: eventId } })
  })

  it('createEventAction: fails when unauthenticated', async () => {
    const supabase = {
      auth: { getUser: jest.fn().mockResolvedValue({ data: { user: null } }) },
    }
    mockedCreateServer.mockResolvedValue(supabase)

    const res = await createEventAction({
      name: 'Pickup Game',
      sport_type: 'Basketball',
      date: '2025-01-01',
      time: '10:30',
      description: 'Open to all',
      venues: [{ name: 'Gym A', address: '123 St', capacity: 10 }],
    })

    expect(res).toEqual({ success: false, error: 'User not authenticated' })
  })

  it('getEventsAction: returns events ordered by date', async () => {
    const events = [
      {
        id: 'evt-2',
        user_id: 'user-1',
        name: 'Game 2',
        sport_type: 'Basketball',
        date: '2025-01-02',
        time: '12:00',
        description: '',
        created_at: '2025-01-01',
        updated_at: '2025-01-01',
        venues: [],
      },
    ]
    const supabase = {
      ...authUser('user-1'),
      from: jest.fn((table) => {
        if (table === 'events') {
          return {
            select: jest.fn(() => ({
              order: jest.fn(() => Promise.resolve({ data: events, error: null })),
            })),
          }
        }
        throw new Error('Unknown table ' + table)
      }),
    }
    mockedCreateServer.mockResolvedValue(supabase)

    const res = await getEventsAction()
    expect(res).toEqual({ success: true, data: events })
  })

  it('getEventByIdAction: anyone can view event', async () => {
    const event = {
      id: 'evt-3',
      user_id: 'someone-else',
      name: 'Open match',
      sport_type: 'Soccer',
      date: '2025-02-01',
      time: '09:00',
      description: '',
      created_at: '2025-01-30',
      updated_at: '2025-01-30',
      venues: [],
    }
    const supabase = {
      ...authUser('user-1'),
      from: jest.fn((table) => {
        if (table === 'events') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn(() => Promise.resolve({ data: event, error: null })),
              })),
            })),
          }
        }
        throw new Error('Unknown table ' + table)
      }),
    }
    mockedCreateServer.mockResolvedValue(supabase)

    const res = await getEventByIdAction('evt-3')
    expect(res).toEqual({ success: true, data: event })
  })

  it('getEventByIdWithOwnershipAction: rejects when not owner', async () => {
    const event = {
      id: 'evt-4',
      user_id: 'owner-2',
      name: 'Private',
      sport_type: 'Tennis',
      date: '2025-03-01',
      time: '08:00',
      description: '',
      created_at: '2025-02-01',
      updated_at: '2025-02-01',
      venues: [],
    }
    const supabase = {
      ...authUser('owner-1'),
      from: jest.fn((table) => {
        if (table === 'events') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn(() => Promise.resolve({ data: event, error: null })),
              })),
            })),
          }
        }
        throw new Error('Unknown table ' + table)
      }),
    }
    mockedCreateServer.mockResolvedValue(supabase)

    const res = await getEventByIdWithOwnershipAction('evt-4')
    expect(res).toEqual({
      success: false,
      error: 'Unauthorized: You do not own this event',
    })
  })

  it('updateEventAction: updates when owner and updates venues', async () => {
    const eventId = 'evt-5'
    const supabase = {
      ...authUser('user-1'),
      from: jest.fn((table) => {
        if (table === 'events') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest
                  .fn()
                  .mockResolvedValue({ data: { user_id: 'user-1' }, error: null }),
              })),
            })),
            update: jest.fn(() => ({
              eq: jest.fn(() => Promise.resolve({ error: null })),
            })),
            delete: jest.fn(() => ({
              eq: jest.fn(() => Promise.resolve({ error: null })),
            })),
          }
        }
        if (table === 'venues') {
          return {
            delete: jest.fn(() => ({
              eq: jest.fn(() => Promise.resolve({ error: null })),
            })),
            insert: jest.fn(() => Promise.resolve({ error: null })),
          }
        }
        throw new Error('Unknown table ' + table)
      }),
    }
    mockedCreateServer.mockResolvedValue(supabase)

    const res = await updateEventAction(eventId, {
      name: 'Updated',
      sport_type: 'Basketball',
      venues: [{ name: 'Gym B', address: '456 St', capacity: 20 }],
    })

    expect(res).toEqual({ success: true, data: { success: true } })
  })

  it('updateEventAction: rejects when not owner', async () => {
    const eventId = 'evt-6'
    const supabase = {
      ...authUser('user-1'),
      from: jest.fn((table) => {
        if (table === 'events') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest
                  .fn()
                  .mockResolvedValue({ data: { user_id: 'owner-2' }, error: null }),
              })),
            })),
          }
        }
        throw new Error('Unknown table ' + table)
      }),
    }
    mockedCreateServer.mockResolvedValue(supabase)

    const res = await updateEventAction(eventId, { name: 'Nope' })
    expect(res).toEqual({
      success: false,
      error: 'Unauthorized: You do not own this event',
    })
  })

  it('deleteEventAction: deletes when owner', async () => {
    const eventId = 'evt-7'
    const supabase = {
      ...authUser('user-1'),
      from: jest.fn((table) => {
        if (table === 'events') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest
                  .fn()
                  .mockResolvedValue({ data: { user_id: 'user-1' }, error: null }),
              })),
            })),
            delete: jest.fn(() => ({
              eq: jest.fn(() => Promise.resolve({ error: null })),
            })),
          }
        }
        throw new Error('Unknown table ' + table)
      }),
    }
    mockedCreateServer.mockResolvedValue(supabase)

    const res = await deleteEventAction(eventId)
    expect(res).toEqual({ success: true, data: { success: true } })
  })

  it('deleteEventAction: rejects when not owner', async () => {
    const eventId = 'evt-8'
    const supabase = {
      ...authUser('user-1'),
      from: jest.fn((table) => {
        if (table === 'events') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest
                  .fn()
                  .mockResolvedValue({ data: { user_id: 'owner-2' }, error: null }),
              })),
            })),
          }
        }
        throw new Error('Unknown table ' + table)
      }),
    }
    mockedCreateServer.mockResolvedValue(supabase)

    const res = await deleteEventAction(eventId)
    expect(res).toEqual({
      success: false,
      error: 'Unauthorized: You do not own this event',
    })
  })
})