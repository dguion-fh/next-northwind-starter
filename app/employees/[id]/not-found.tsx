import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function EmployeeNotFound() {
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Employee Not Found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The employee you&apos;re looking for doesn&apos;t exist or may have been removed.
          </p>
          <Link href="/employees">
            <Button>Back to Employees</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
