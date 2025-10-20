"use server";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import { employees, orders, customers } from "@/drizzle/schema";

export async function getAllEmployees() {
  try {
    const allEmployees = await db.select().from(employees);
    return { success: true, data: allEmployees };
  } catch (error) {
    console.error("Failed to fetch employees:", error);
    return { success: false, error: "Failed to fetch employees" };
  }
}

export async function getEmployeeById(id: number) {
  try {
    const employee = await db
      .select()
      .from(employees)
      .where(eq(employees.employeeId, id))
      .limit(1);

    return { success: true, data: employee[0] || null };
  } catch (error) {
    console.error("Failed to fetch employee:", error);
    return { success: false, error: "Failed to fetch employee" };
  }
}

export async function getEmployeeWithOrders(id: string) {
  try {
    // 1. Validate and convert the id to a number with proper bounds checking
    // SECURITY FIX: Add radix and bounds to prevent integer overflow
    const employeeId = parseInt(id, 10);
    if (isNaN(employeeId) || employeeId < 1 || employeeId > 2147483647) {
      return { success: false, error: "Invalid employee ID" };
    }

    // 2. PERFORMANCE FIX: Single query using Drizzle relational query
    // This eliminates N+1 query problem by fetching employee and orders together
    const result = await db.query.employees.findFirst({
      where: eq(employees.employeeId, employeeId),
      with: {
        orders: {
          with: {
            customer: true,
          },
        },
      },
    });

    // 3. Check if employee exists
    if (!result) {
      return { success: false, error: "Employee not found" };
    }

    // 4. Transform orders to match expected format and calculate stats
    const transformedOrders = result.orders.map((order) => ({
      orderId: order.orderId,
      orderDate: order.orderDate,
      customerId: order.customerId,
      shipperId: order.shipperId,
      customerName: order.customer?.customerName || null,
    }));

    // PERFORMANCE FIX: Calculate stats once on server instead of in render
    const stats = {
      totalOrders: transformedOrders.length,
      uniqueCustomers: new Set(transformedOrders.map((o) => o.customerId))
        .size,
      shippedOrders: transformedOrders.filter((o) => o.shipperId !== null)
        .length,
    };

    return {
      success: true,
      data: {
        employee: result,
        orders: transformedOrders,
        stats,
      },
    };
  } catch (error) {
    // SECURITY FIX: Sanitize error logging to prevent information disclosure
    // Only log safe metadata, not full error details
    console.error("Failed to fetch employee details", {
      employeeId: id,
      errorType: error instanceof Error ? error.name : "Unknown",
      // Do NOT log: error.message, error.stack
    });
    return { success: false, error: "Failed to fetch employee details" };
  }
}
