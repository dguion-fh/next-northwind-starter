"use client";

import { ColumnDef } from "@tanstack/react-table";

export type EmployeeOrder = {
  orderId: number | null
  orderDate: string | null
  customerId: number | null
  shipperId: number | null
  customerName: string | null
}

export const columns: ColumnDef<EmployeeOrder>[] = [
  {
    accessorKey: "orderId",
    header: "Order ID",
  },
  {
    accessorKey: "customerName",
    header: "Customer Name",
    cell: ({ row }) => {
      const name = row.getValue("customerName") as string
      return name || "N/A"
    },
  },
  {
    accessorKey: "orderDate",
    header: "Order Date",
    cell: ({ row }) => {
      const date = row.getValue("orderDate") as string
      if (!date) return "N/A"

      try {
        const parsedDate = new Date(date)
        return isNaN(parsedDate.getTime()) ? "Invalid Date" : parsedDate.toLocaleDateString()
      } catch {
        return "Invalid Date"
      }
    },
  },
];
