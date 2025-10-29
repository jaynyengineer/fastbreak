import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getEventByIdAction } from '@/lib/actions/events'
import { EventEditForm } from '@/components/forms/event-edit-form'

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
  const result = await getEventByIdAction(id)

  if (!result.success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-600">Error</h2>
              <p className="text-gray-600 mt-2">{result.error}</p>
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
