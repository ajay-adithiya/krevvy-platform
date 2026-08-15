'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMyOrders } from '../../../lib/api-client';
import { Order } from '../../../types';

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyOrders(1, 20)
      .then((data) => {
        setOrders(data.data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-6">Order History</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">You have no past orders.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <p className="font-medium text-gray-900">Order #{order.orderNumber}</p>
                <p className="text-sm text-gray-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                <p className="text-sm text-gray-500">Status: <span className="font-semibold text-indigo-600">{order.status}</span></p>
              </div>
              <div className="mt-4 md:mt-0 text-left md:text-right">
                <p className="font-bold text-gray-900">₹{Number(order.totalAmount).toFixed(2)}</p>
                <Link
                  href={`/account/orders/${order.id}`}
                  className="mt-2 inline-block text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  View Details &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
