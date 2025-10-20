import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="container mx-auto py-10">
      {/* Back button skeleton */}
      <div className="mb-6">
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Employee info card skeleton */}
      <Card className="mb-6">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="sm:col-span-2">
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders card skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Table header skeleton */}
            <div className="flex gap-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-32" />
            </div>
            {/* Table rows skeleton */}
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-8 w-32" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
