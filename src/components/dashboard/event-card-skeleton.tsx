import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function EventCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="space-y-3">
          <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Date and Time */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
        </div>

        {/* Venue */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse" />
          <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  )
}
