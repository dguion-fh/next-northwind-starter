import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { RevenueChart } from "@/components/revenue-chart";
import {
  getDashboardMetrics,
  getRecentOrders,
  getRevenueByCategory,
} from "@/db/actions/dashboard";
import { columns } from "./columns";
import { Users, ShoppingCart, Package } from "lucide-react";

export default async function DashboardPage() {
  // Fetch all dashboard data in parallel for better performance
  const [metricsResult, ordersResult, revenueResult] = await Promise.all([
    getDashboardMetrics(),
    getRecentOrders(),
    getRevenueByCategory(),
  ]);

  // Extract data from results with fallbacks
  const metrics = metricsResult.success ? metricsResult.data : null;
  const recentOrders = ordersResult.success && ordersResult.data ? ordersResult.data : [];
  const revenueData = revenueResult.success && revenueResult.data ? revenueResult.data : [];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Three metric cards in a responsive grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Card 1: Total Customers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.totalCustomers ?? "—"}
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Total Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.totalOrders ?? "—"}
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Total Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.totalProducts ?? "—"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue chart */}
      <RevenueChart data={revenueData} />

      {/* Recent orders table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={recentOrders}
            searchKey="customerName"
            searchPlaceholder="Search by customer..."
          />
        </CardContent>
      </Card>
    </div>
  );
}
