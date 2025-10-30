import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { EventCard } from '../event-card'

function makeEvent(overrides = {}) {
  return {
    id: '11111111-1111-1111-1111-111111111111',
    user_id: '22222222-2222-2222-2222-222222222222',
    name: 'Downtown Soccer Tournament',
    sport_type: 'Soccer',
    date: '2025-10-30',
    time: '14:30',
    description: 'Fun event',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    venues: [
      {
        id: '33333333-3333-3333-3333-333333333333',
        name: 'Main Field',
        address: '123 Main St',
        capacity: 1200,
        created_at: new Date().toISOString(),
      },
    ],
    ...overrides,
  }
}

describe('EventCard details', () => {
  it('renders sport type, formatted date, and time', () => {
    render(<EventCard event={makeEvent()} currentUserId="owner" />)
    expect(screen.getByText('Soccer')).toBeInTheDocument()
    expect(screen.getByText(/Oct/i)).toBeInTheDocument()
    expect(screen.getByText('14:30')).toBeInTheDocument()
  })

  it('renders first venue details and capacity formatted', () => {
    render(<EventCard event={makeEvent()} currentUserId="owner" />)
    expect(screen.getByText('Main Field')).toBeInTheDocument()
    expect(screen.getByText('123 Main St')).toBeInTheDocument()
    expect(screen.getByText(/Capacity: 1,200/)).toBeInTheDocument()
  })

  it('renders +N more venues when multiple venues exist', () => {
    const event = makeEvent({
      venues: [
        {
          id: 'v1',
          name: 'Main Field',
          address: '123 Main St',
          capacity: 100,
          created_at: new Date().toISOString(),
        },
        {
          id: 'v2',
          name: 'Secondary Field',
          address: '456 Ave',
          capacity: 50,
          created_at: new Date().toISOString(),
        },
      ],
    })
    render(<EventCard event={event} currentUserId="owner" />)
    expect(screen.getByText('+1 more venue')).toBeInTheDocument()
  })

  it('does not render description when empty', () => {
    const event = makeEvent({ description: '' })
    render(<EventCard event={event} currentUserId="owner" />)
    expect(screen.queryByText('Fun event')).not.toBeInTheDocument()
  })
})