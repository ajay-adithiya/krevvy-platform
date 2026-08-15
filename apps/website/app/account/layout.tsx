import { AuthGuard } from '../../components/auth/auth-guard';
import Link from 'next/link';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold tracking-tight text-gray-900">My Account</h1>
        <div className="flex flex-col gap-8 md:flex-row">
          <aside className="w-full md:w-64 flex-shrink-0">
            <nav className="flex flex-col space-y-1">
              <Link
                href="/account"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
              >
                Profile Overview
              </Link>
              <Link
                href="/account/orders"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
              >
                Order History
              </Link>
            </nav>
          </aside>
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
