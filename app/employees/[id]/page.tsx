import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { getEmployeeWithOrders } from '@/db/actions/employees'
import { columns } from './columns'
import { User } from 'lucide-react'

interface EmployeeDetailsPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EmployeeDetailsPage({
  params,
}: EmployeeDetailsPageProps) {
  // Await the params since they're now a Promise in Next.js 15
  const { id } = await params;

  // Fetch employee data using the server action
  const result = await getEmployeeWithOrders(id)

  // Handle not found case
  if (!result.success || !result.data) {
    notFound()
  }

  // Destructure employee, orders, and stats from result.data
  const { employee, orders, stats } = result.data

  return (
    <div className="container mx-auto py-10">
      {/* Header with "Back to Employees" button */}
      <div className="mb-6">
        <Link href="/employees">
          <Button variant="outline">← Back to Employees</Button>
        </Link>
      </div>

      {/* Display employee information in a Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-4">
            {/* Employee photo placeholder */}
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <div>{employee.firstName} {employee.lastName}</div>
              <div className="text-sm font-normal text-muted-foreground">
                Employee ID: {employee.employeeId}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Statistics section - now calculated on server for better performance */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{stats.uniqueCustomers}</div>
                <p className="text-sm text-muted-foreground">Unique Customers</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{stats.shippedOrders}</div>
                <p className="text-sm text-muted-foreground">Shipped Orders</p>
              </CardContent>
            </Card>
          </div>

          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {employee.birthDate && (
              <div>
                <dt className="font-semibold text-muted-foreground">Birth Date</dt>
                <dd>
                  {(() => {
                    try {
                      const date = new Date(employee.birthDate as string);
                      return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
                    } catch {
                      return 'Invalid Date';
                    }
                  })()}
                </dd>
              </div>
            )}
            {employee.notes && (
              <div className="sm:col-span-2">
                <dt className="font-semibold text-muted-foreground">Notes</dt>
                <dd className="mt-1">{employee.notes}</dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      {/* Display orders in a second Card with DataTable */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={orders} />
        </CardContent>
      </Card>
    </div>
  );
}
