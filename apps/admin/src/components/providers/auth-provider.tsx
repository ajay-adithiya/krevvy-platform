"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/auth.store";
import { usePathname, useRouter } from "next/navigation";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setAccessToken, isAuthenticated } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const accessToken = response.data.accessToken;
        if (accessToken) {
          setAccessToken(accessToken);
        }
      } catch (error) {
        setAccessToken(null);
      } finally {
        setIsInitializing(false);
      }
    };

    initAuth();
  }, [setAccessToken]);

  useEffect(() => {
    if (!isInitializing) {
      if (!isAuthenticated && !pathname.includes("/login")) {
        router.push("/login");
      }
      if (isAuthenticated && pathname.includes("/login")) {
        router.push("/dashboard/orders");
      }
    }
  }, [isAuthenticated, isInitializing, pathname, router]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}
