"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token.");
    }
  }, [token]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    setIsSubmitting(true);
    setError("");

    try {
      await api.post("/auth/reset-password", { token, newPassword });
      setMessage("Your password has been reset successfully. You can now login with your new password.");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid or expired token. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="mx-auto mt-32 w-[400px] p-8">
      <h1 className="mb-6 text-2xl font-bold">Reset Password</h1>

      {message ? (
        <div className="space-y-4">
          <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm">
            {message}
          </div>
          <Button asChild className="w-full">
            <Link href="/login">Go to Login</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          {!token && (
             <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm mb-4">
               {error}
             </div>
          )}

          <Input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={!token || isSubmitting}
            required
          />

          <Input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={!token || isSubmitting}
            required
          />

          {error && token && <p className="text-sm text-red-500">{error}</p>}

          <Button className="w-full" disabled={!token || isSubmitting}>
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      )}
    </Card>
  );
}
