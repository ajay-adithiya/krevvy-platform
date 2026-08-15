"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOrders } from "@/features/orders/hooks/use-orders";
import { orderColumns } from "@/features/orders/components/order-columns";
import { OrderStatus } from "@/features/orders/types";

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "ALL">("ALL");
  const [isPaid, setIsPaid] = useState<string>("ALL");

  const limit = 10;

  // Simple debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset page on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, error } = useOrders({
    page,
    limit,
    search: debouncedSearch || undefined,
    status: status,
    isPaid: isPaid,
  });

  const handleStatusChange = (val: string) => {
    setStatus(val as OrderStatus | "ALL");
    setPage(1);
  };

  const handlePaidChange = (val: string) => {
    setIsPaid(val);
    setPage(1);
  };

  if (error) {
    return <p className="text-red-500">Failed to load orders.</p>;
  }

  const pagination = data?.pagination;
  const orders = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">
            Manage your orders and fulfillments.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Input
          placeholder="Search by order number, name, email, phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />

        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value={OrderStatus.PENDING_PAYMENT}>Pending Payment</SelectItem>
            <SelectItem value={OrderStatus.PAID}>Paid</SelectItem>
            <SelectItem value={OrderStatus.PROCESSING}>Processing</SelectItem>
            <SelectItem value={OrderStatus.SHIPPED}>Shipped</SelectItem>
            <SelectItem value={OrderStatus.DELIVERED}>Delivered</SelectItem>
            <SelectItem value={OrderStatus.PAYMENT_FAILED}>Payment Failed</SelectItem>
            <SelectItem value={OrderStatus.EXPIRED}>Expired</SelectItem>
            <SelectItem value={OrderStatus.CANCELLED}>Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select value={isPaid} onValueChange={handlePaidChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Payments</SelectItem>
            <SelectItem value="true">Paid Only</SelectItem>
            <SelectItem value="false">Unpaid Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && <p>Loading orders...</p>}

      {!isLoading && (
        <>
          <DataTable
            columns={orderColumns}
            data={orders}
          />

          {pagination && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing page {pagination.page} of {pagination.totalPages || 1} ({pagination.total} total orders)
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={pagination.page <= 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
