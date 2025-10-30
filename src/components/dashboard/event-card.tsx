import { EventWithVenues } from '@/lib/schemas/events'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Calendar, MapPin, Trophy } from 'lucide-react'

interface EventCardProps {
  event: EventWithVenues
  currentUserId?: string
}

export function EventCard({ event, currentUserId }: EventCardProps) {
  const eventDate = new Date(event.date)
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const venue = event.venues?.[0]

  return (
    <Card className="hover:shadow-lg transition">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl">{event.name}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-2">
              <Trophy className="w-4 h-4" />
              {event.sport_type}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Date and Time */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <div>
            <p>{formattedDate}</p>
            <p className="text-xs text-gray-500">{event.time}</p>
          </div>
        </div>

        {/* Venue */}
        {venue && (
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">{venue.name}</p>
              <p className="text-xs text-gray-500">{venue.address}</p>
              {venue.capacity && (
                <p className="text-xs text-gray-500">Capacity: {venue.capacity.toLocaleString()}</p>
              )}
            </div>
          </div>
        )}

        {/* Description */}
        {event.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
        )}

        {/* Venue Count */}
        {event.venues && event.venues.length > 1 && (
          <p className="text-xs text-blue-600">
            +{event.venues.length - 1} more {event.venues.length - 1 === 1 ? 'venue' : 'venues'}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {currentUserId && event.user_id === currentUserId ? (
            <>
              <Link href={`/events/${event.id}/edit`} className="flex-1">
                <Button variant="outline" className="w-full">
                  Edit
                </Button>
              </Link>
              <Link href={`/events/${event.id}`} className="flex-1">
                <Button variant="default" className="w-full">
                  View
                </Button>
              </Link>
            </>
          ) : (
            <Link href={`/events/${event.id}`} className="w-full">
              <Button variant="default" className="w-full">
                View Details
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
