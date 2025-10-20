"use client";

import { ColumnDef } from "@tanstack/react-table";

export type RecentOrder = {
  orderId: number | null
  orderDate: string | null
  customerName: string | null
  shipCountry: string | null
}

export const columns: ColumnDef<RecentOrder>[] = [
  {
    accessorKey: "orderId",
    header: "Order ID",
  },
  {
    accessorKey: "customerName",
    header: "Customer Name",
  },
  {
    accessorKey: "orderDate",
    header: "Order Date",
    cell: ({ row }) => {
      const date = row.getValue("orderDate") as string
      if (!date) return "-"

      try {
        const parsedDate = new Date(date)
        return isNaN(parsedDate.getTime()) ? "Invalid Date" : parsedDate.toLocaleDateString()
      } catch {
        return "Invalid Date"
      }
    },
  },
  {
    accessorKey: "shipCountry",
    header: "Shipper",
  },
];
