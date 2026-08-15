"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "../../store/auth.store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setTokens, setUser, logout, isAuthenticated } = useAuthStore();
  const initAttempted = useRef(false);

  useEffect(() => {
    // Only attempt init once per mount
    if (initAttempted.current) return;
    initAttempted.current = true;

    // If we're somehow already authenticated (e.g. from hot reload memory), skip
    if (isAuthenticated) return;

    async function initAuth() {
      try {
        // Try to refresh token on initial load
        const refreshRes = await fetch("http://localhost:5000/api/v1/customers/auth/refresh", {
          method: "POST",
          credentials: "include",
        });

        if (refreshRes.ok) {
          const { accessToken } = await refreshRes.json();
          setTokens({ accessToken });

          // Fetch user profile
          const profileRes = await fetch("http://localhost:5000/api/v1/customers/me", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (profileRes.ok) {
            const user = await profileRes.json();
            setUser(user);
          } else {
            logout();
          }
        }
      } catch (err) {
        // Ignore errors, user is just unauthenticated
        console.error("Auth init failed:", err);
      }
    }

    initAuth();
  }, [setTokens, setUser, logout, isAuthenticated]);

  return <>{children}</>;
}
