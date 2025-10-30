import { notFound, redirect } from 'next/navigation'
import { getEventByIdAction } from '@/lib/actions/events'
import { isActionSuccess } from '@/lib/action-response'
import { getCurrentUserAction } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Calendar, MapPin, Trophy, ArrowLeft } from 'lucide-react'

interface EventViewPageProps {
  params: Promise<{ id: string }>
}

export default async function EventViewPage({ params }: EventViewPageProps) {
  const { id } = await params

  // Get current user
  const userResult = await getCurrentUserAction()
  if (!isActionSuccess(userResult) || !userResult.data.user) {
    redirect('/login')
  }

  // Fetch event
  const eventResult = await getEventByIdAction(id)
  if (!isActionSuccess(eventResult)) {
    notFound()
  }

  const event = eventResult.data
  const currentUser = userResult.data.user

  const eventDate = new Date(event.date)
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  // Check if current user owns this event
  const isOwner = currentUser?.id === event.user_id

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Event Details Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">{event.name}</CardTitle>
                <div className="flex items-center gap-2 text-gray-600">
                  <Trophy className="w-5 h-5" />
                  <span className="text-lg">{event.sport_type}</span>
                </div>
              </div>
              {isOwner && (
                <Link href={`/events/${event.id}/edit`}>
                  <Button>Edit Event</Button>
                </Link>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Date and Time */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Date & Time</h3>
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="w-5 h-5" />
                <div>
                  <p className="font-medium">{formattedDate}</p>
                  <p className="text-sm text-gray-500">{event.time}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
              </div>
            )}

            {/* Venues */}
            {event.venues && event.venues.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-3">
                  {event.venues.length === 1 ? 'Venue' : 'Venues'}
                </h3>
                <div className="space-y-4">
                  {event.venues.map((venue) => (
                    <Card key={venue.id} className="bg-gray-50">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-1">{venue.name}</h4>
                            <p className="text-gray-600 mb-1">{venue.address}</p>
                            {/* City/State fields are not part of the schema; address includes full address */}
                            {venue.capacity && (
                              <p className="text-sm text-gray-500 mt-2">
                                Capacity: {venue.capacity.toLocaleString()} people
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Event Metadata */}
            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                <div>
                  <span className="font-medium">Created:</span>{' '}
                  {new Date(event.created_at).toLocaleDateString()}
                </div>
                {event.updated_at && (
                  <div>
                    <span className="font-medium">Last Updated:</span>{' '}
                    {new Date(event.updated_at).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
