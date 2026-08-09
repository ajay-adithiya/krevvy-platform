"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Product } from "../types/product.types";

import { ProductActions } from "./product-actions";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Product",
  },
  {
    accessorKey: "category.name",
    header: "Category",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => `₹${row.original.price}`,
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) =>
      row.original.isActive ? "Active" : "Inactive",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ProductActions product={row.original} />
    ),
  }
];