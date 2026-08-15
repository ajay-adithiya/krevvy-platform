'use client';

import { useAuthStore } from '../../store/auth.store';

export default function AccountOverviewPage() {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-6">Profile Details</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-500">Name</label>
          <div className="mt-1 text-sm text-gray-900">{user.name || 'Not provided'}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500">Email</label>
          <div className="mt-1 text-sm text-gray-900">{user.email}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500">Phone</label>
          <div className="mt-1 text-sm text-gray-900">{user.phone || 'Not provided'}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500">Member Since</label>
          <div className="mt-1 text-sm text-gray-900">
            {new Date(user.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
