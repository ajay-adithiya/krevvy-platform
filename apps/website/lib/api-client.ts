import { useAuthStore } from '../store/auth.store';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

let isRefreshing = false;
let refreshSubscribers: ((token: string | null) => void)[] = [];

function onRefreshed(token: string | null) {
  refreshSubscribers.map(cb => cb(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(cb: (token: string | null) => void) {
  refreshSubscribers.push(cb);
}

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const store = useAuthStore.getState();

  const headers = new Headers(options.headers || {});

  if (store.accessToken) {
    headers.set('Authorization', `Bearer ${store.accessToken}`);
  }

  let response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && store.isAuthenticated) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/customers/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });

        if (refreshResponse.ok) {
          const tokens = await refreshResponse.json();
          store.setTokens({ accessToken: tokens.accessToken });
          isRefreshing = false;
          onRefreshed(tokens.accessToken);

          // Retry the initiating request
          const newHeaders = new Headers(options.headers || {});
          newHeaders.set('Authorization', `Bearer ${tokens.accessToken}`);
          return fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers: newHeaders,
          });
        } else {
          isRefreshing = false;
          store.logout();
          onRefreshed(null);
          return response;
        }
      } catch (err) {
        isRefreshing = false;
        store.logout();
        onRefreshed(null);
        return response;
      }
    }

    return new Promise((resolve) => {
      addRefreshSubscriber((newToken) => {
        if (!newToken) {
          resolve(response);
          return;
        }

        const newHeaders = new Headers(options.headers || {});
        newHeaders.set('Authorization', `Bearer ${newToken}`);

        resolve(
          fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers: newHeaders,
          })
        );
      });
    });
  }

  return response;
}

export async function getMyOrders(page = 1, limit = 10) {
  const res = await fetchWithAuth(`/customers/me/orders?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}

export async function getMyOrderById(id: string) {
  const res = await fetchWithAuth(`/customers/me/orders/${id}`);
  if (!res.ok) throw new Error('Failed to fetch order details');
  return res.json();
}
