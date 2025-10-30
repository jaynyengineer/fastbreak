import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getEventByIdWithOwnershipAction } from '@/lib/actions/events'
import { EventEditForm } from '@/components/forms/event-edit-form'
import { Button } from '@/components/ui/button'

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // Check authentication
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get event ID from params
  const { id } = await params

  // Fetch event with ownership check
  const result = await getEventByIdWithOwnershipAction(id)

  if (!result.success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-8">
            <div className="text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
                <p className="text-gray-600 mt-2">
                  {result.error || 'You do not have permission to edit this event.'}
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                <h3 className="font-semibold text-blue-900 mb-2">Why am I seeing this?</h3>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Only the event creator can edit or delete their events</li>
                  <li>This helps maintain data integrity and security</li>
                  <li>You can create your own events from the dashboard</li>
                </ul>
              </div>

              <div className="flex gap-3 justify-center pt-4">
                <Button asChild variant="default">
                  <Link href="/dashboard">Back to Dashboard</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/events/create">Create New Event</Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const event = result.data

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <EventEditForm event={event} />
        </div>
      </main>
    </div>
  )
}
