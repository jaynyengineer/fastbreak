import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { DashboardClient } from '../dashboard-client'

function makeEvent(overrides = {}) {
  return {
    id: '00000000-0000-0000-0000-000000000000',
    user_id: 'user-1',
    name: 'Downtown Soccer Tournament',
    sport_type: 'Soccer',
    date: '2025-10-30',
    time: '14:30',
    description: 'Fun event',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    venues: [
      {
        id: '11111111-1111-1111-1111-111111111111',
        name: 'Main Field',
        address: '123 Main St',
        capacity: 100,
        created_at: new Date().toISOString(),
      },
    ],
    ...overrides,
  }
}

describe('DashboardClient', () => {
  it('shows empty state when no events', () => {
    render(<DashboardClient initialEvents={[]} currentUserId="user-1" />)
    expect(
      screen.getByText(/No events yet\. Create one to get started!/i)
    ).toBeInTheDocument()
  })

  it('filters by search query', () => {
    const events = [
      makeEvent({ id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'Soccer Finals' }),
      makeEvent({ id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', name: 'Tennis Open', sport_type: 'Tennis' }),
    ]
    render(<DashboardClient initialEvents={events} currentUserId="user-1" />)

    const input = screen.getByPlaceholderText(/Search by event name/i)
    fireEvent.change(input, { target: { value: 'tennis' } })

    expect(screen.getByText('Tennis Open')).toBeInTheDocument()
    expect(screen.queryByText('Soccer Finals')).not.toBeInTheDocument()
    expect(screen.getByText(/Showing 1 of 2 event/)).toBeInTheDocument()
  })

  it('filters by sport type', () => {
    const events = [
      makeEvent({ id: 'cccccccc-cccc-cccc-cccc-cccccccccccc', name: 'Soccer Finals', sport_type: 'Soccer' }),
      makeEvent({ id: 'dddddddd-dddd-dddd-dddd-dddddddddddd', name: 'Tennis Open', sport_type: 'Tennis' }),
    ]
    render(<DashboardClient initialEvents={events} currentUserId="user-1" />)

    // Radix Select trigger uses role="combobox" without an accessible name
    const trigger = screen.getByRole('combobox')
    fireEvent.click(trigger)
    const option = screen.getByRole('option', { name: 'Tennis' })
    fireEvent.click(option)

    expect(screen.getByText('Tennis Open')).toBeInTheDocument()
    expect(screen.queryByText('Soccer Finals')).not.toBeInTheDocument()
  })

  it('shows informative message when search yields no results', () => {
    const events = [makeEvent({ id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', name: 'Soccer Finals' })]
    render(<DashboardClient initialEvents={events} currentUserId="user-1" />)

    const input = screen.getByPlaceholderText(/Search by event name/i)
    fireEvent.change(input, { target: { value: 'basketball' } })

    expect(screen.getByText(/No events match your search\./i)).toBeInTheDocument()
  })
})