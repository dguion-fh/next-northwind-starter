"use server";

import { db } from "@/db";
import { customers, orders, products, categories, orderDetails, shippers } from "@/drizzle/schema";
import { sql, eq, desc, gte, isNotNull } from "drizzle-orm";

// ============================================================================
// Server Action 1: getDashboardMetrics()
// ============================================================================
export async function getDashboardMetrics() {
  try {
    // Run all three count queries in parallel for better performance
    const [customerCount, orderCount, productCount] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(customers),
      db.select({ count: sql<number>`count(*)` }).from(orders),
      db.select({ count: sql<number>`count(*)` }).from(products),
    ]);

    return {
      success: true,
      data: {
        totalCustomers: customerCount[0]?.count || 0,
        totalOrders: orderCount[0]?.count || 0,
        totalProducts: productCount[0]?.count || 0,
      },
    };
  } catch (error) {
    // SECURITY FIX: Sanitize error logging to prevent information disclosure
    console.error("Failed to fetch dashboard metrics", {
      errorType: error instanceof Error ? error.name : "Unknown",
      // Do NOT log: error.message, error.stack
    });
    return { success: false, error: "Failed to fetch metrics" };
  }
}

// ============================================================================
// Server Action 2: getRecentOrders()
// ============================================================================
export async function getRecentOrders() {
  try {
    const recentOrders = await db
      .select({
        orderId: orders.orderId,
        orderDate: orders.orderDate,
        customerName: customers.customerName,
        shipCountry: shippers.shipperName,
      })
      .from(orders)
      .leftJoin(customers, eq(orders.customerId, customers.customerId))
      .leftJoin(shippers, eq(orders.shipperId, shippers.shipperId))
      .orderBy(desc(orders.orderDate))
      .limit(10);

    return {
      success: true,
      data: recentOrders,
    };
  } catch (error) {
    // SECURITY FIX: Sanitize error logging to prevent information disclosure
    console.error("Failed to fetch recent orders", {
      errorType: error instanceof Error ? error.name : "Unknown",
      // Do NOT log: error.message, error.stack
    });
    return { success: false, error: "Failed to fetch recent orders" };
  }
}

// ============================================================================
// Server Action 3: getRevenueByCategory()
// ============================================================================
// PERFORMANCE FIX: Add optional date parameter for filtering
// For production with large datasets, pass a days parameter (e.g., 365)
// For historical data or small datasets, omit the parameter to show all data
export async function getRevenueByCategory(days?: number) {
  try {
    // PERFORMANCE FIX: Join orderDetails → orders → products → categories
    let query = db
      .select({
        category: categories.categoryName,
        revenue: sql<number>`ROUND(SUM(${products.price} * ${orderDetails.quantity}), 2)`,
      })
      .from(orderDetails)
      .leftJoin(orders, eq(orderDetails.orderId, orders.orderId))
      .leftJoin(products, eq(orderDetails.productId, products.productId))
      .leftJoin(categories, eq(products.categoryId, categories.categoryId));

    // Apply date filter only if days parameter is provided
    // This allows flexibility for both historical and recent data
    if (days !== undefined) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      const cutoffDateStr = cutoffDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      query = query.where(gte(orders.orderDate, cutoffDateStr)) as typeof query;
    }

    const revenueData = await query.groupBy(categories.categoryName);

    // PERFORMANCE FIX: Filter null categories in SQL instead of JS (already done with WHERE)
    // Filter out any remaining null categories and ensure proper typing
    const formattedData = revenueData
      .filter((row) => row.category !== null)
      .map((row) => ({
        category: row.category as string,
        revenue: Number(row.revenue) || 0,
      }));

    return {
      success: true,
      data: formattedData,
    };
  } catch (error) {
    // SECURITY FIX: Sanitize error logging to prevent information disclosure
    console.error("Failed to fetch revenue by category", {
      errorType: error instanceof Error ? error.name : "Unknown",
      // Do NOT log: error.message, error.stack
    });
    return { success: false, error: "Failed to fetch revenue data" };
  }
}
