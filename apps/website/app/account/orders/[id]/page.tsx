'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getMyOrderById } from '../../../../lib/api-client';

export default function AccountOrderDetailsPage() {
  const { id } = useParams() as { id: string };
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    getMyOrderById(id)
      .then((data) => {
        setOrder(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading order details...</div>;
  if (error || !order) return <div className="text-red-500">{error || 'Order not found'}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Order #{order.orderNumber}</h2>
        <Link href="/account/orders" className="text-sm text-indigo-600 hover:text-indigo-800">
          &larr; Back to Orders
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Order Information</h3>
          <p className="text-sm text-gray-600">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
          <p className="text-sm text-gray-600">Status: <span className="font-semibold text-indigo-600">{order.status}</span></p>
          <p className="text-sm text-gray-600">Payment Status: {order.isPaid ? 'Paid' : 'Unpaid'}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Shipping Address</h3>
          <p className="text-sm text-gray-600">{order.shippingAddressLine1}</p>
          {order.shippingAddressLine2 && <p className="text-sm text-gray-600">{order.shippingAddressLine2}</p>}
          <p className="text-sm text-gray-600">{order.shippingCity}, {order.shippingState} {order.shippingPostalCode}</p>
          <p className="text-sm text-gray-600">{order.shippingCountry}</p>
        </div>
      </div>

      <h3 className="font-semibold text-gray-900 mb-4">Items</h3>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {order.items?.map((item: any) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.productName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{Number(item.price).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                  ₹{(Number(item.price) * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 border-t pt-4">
        <div className="flex justify-end">
          <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>₹{Number(order.subTotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping</span>
              <span>{Number(order.shippingFee) === 0 ? 'Free' : `₹${Number(order.shippingFee).toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Tax (GST)</span>
              <span>₹{Number(order.tax).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
              <span>Total</span>
              <span>₹{Number(order.totalAmount).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
