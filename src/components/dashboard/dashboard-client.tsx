'use client'

import { useState, useMemo } from 'react'
import { SPORT_TYPES } from '@/lib/schemas/events'
import type { EventWithVenues } from '@/lib/schemas/events'
import { EventCard } from './event-card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface DashboardClientProps {
  initialEvents: EventWithVenues[]
  currentUserId: string
}

export function DashboardClient({ initialEvents, currentUserId }: DashboardClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSport, setSelectedSport] = useState<string>('all')

  const filteredEvents = useMemo(() => {
    return initialEvents.filter((event) => {
      const matchesSearch = event.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
      const matchesSport = selectedSport === 'all' || event.sport_type === selectedSport

      return matchesSearch && matchesSport
    })
  }, [initialEvents, searchQuery, selectedSport])

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Events
            </label>
            <Input
              type="text"
              placeholder="Search by event name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Sport Type
            </label>
            <Select value={selectedSport} onValueChange={setSelectedSport}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Sports" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sports</SelectItem>
                {SPORT_TYPES.map((sport) => (
                  <SelectItem key={sport} value={sport}>
                    {sport}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">
              {initialEvents.length === 0
                ? 'No events yet. Create one to get started!'
                : 'No events match your search.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} currentUserId={currentUserId} />
            ))}
          </div>
        )}
      </div>

      {filteredEvents.length > 0 && (
        <div className="text-sm text-gray-600 text-right">
          Showing {filteredEvents.length} of {initialEvents.length} event
          {filteredEvents.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}
