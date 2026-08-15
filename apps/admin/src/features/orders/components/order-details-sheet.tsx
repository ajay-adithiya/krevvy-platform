"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useOrder } from "../hooks/use-order";
import { OrderStatus } from "../types";
import { useUpdateOrderStatus } from "../hooks/use-update-order-status";

interface OrderDetailsSheetProps {
  orderId: string;
  orderNumber: string;
}

export function OrderDetailsSheet({ orderId, orderNumber }: OrderDetailsSheetProps) {
  const [open, setOpen] = useState(false);
  const { data: order, isLoading, error } = useOrder(orderId);
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

  const handleStatusUpdate = (status: OrderStatus) => {
    updateStatus({ id: orderId, status });
  };

  const getNextActions = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PAID:
        return [{ label: "Mark as Processing", nextStatus: OrderStatus.PROCESSING }];
      case OrderStatus.PROCESSING:
        return [{ label: "Mark as Shipped", nextStatus: OrderStatus.SHIPPED }];
      case OrderStatus.SHIPPED:
        return [{ label: "Mark as Delivered", nextStatus: OrderStatus.DELIVERED }];
      default:
        return [];
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          View Details
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Order {orderNumber}</SheetTitle>
          <SheetDescription>View order details and manage fulfillment</SheetDescription>
        </SheetHeader>

        {isLoading && <p>Loading details...</p>}
        {error && <p className="text-red-500">Failed to load order details.</p>}

        {order && (
          <div className="space-y-8">
            {/* Actions */}
            <div className="flex gap-2">
              {getNextActions(order.status).map((action) => (
                <Button
                  key={action.nextStatus}
                  onClick={() => handleStatusUpdate(action.nextStatus)}
                  disabled={isPending}
                >
                  {isPending ? "Updating..." : action.label}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Customer</h4>
                <p>{order.customerName}</p>
                <p>{order.customerEmail}</p>
                <p>{order.customerPhone}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Order Info</h4>
                <p>Status: <span className="font-medium">{order.status}</span></p>
                <p>Payment: {order.isPaid ? "Paid" : "Unpaid"}</p>
                <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Shipping Address</h4>
                <p>{order.shippingAddressLine1}</p>
                {order.shippingAddressLine2 && <p>{order.shippingAddressLine2}</p>}
                <p>{order.shippingCity}, {order.shippingState} {order.shippingPostalCode}</p>
                <p>{order.shippingCountry}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Payment Details</h4>
                <p>Gateway ID: {order.razorpayOrderId || "N/A"}</p>
                <p>Payment ID: {order.razorpayPaymentId || "N/A"}</p>
                {order.paidAt && <p>Paid At: {new Date(order.paidAt).toLocaleString()}</p>}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm">Order Items</h4>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-2 text-left">Product</th>
                      <th className="p-2 text-right">Qty</th>
                      <th className="p-2 text-right">Price</th>
                      <th className="p-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="p-2">{item.productName}</td>
                        <td className="p-2 text-right">{item.quantity}</td>
                        <td className="p-2 text-right">₹{item.priceAtTime.toFixed(2)}</td>
                        <td className="p-2 text-right">₹{(item.quantity * item.priceAtTime).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end text-sm">
              <div className="w-48 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{order.subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>₹{order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>₹{order.shippingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>₹{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
