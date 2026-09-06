"use client";

import { useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await api.post("/auth/forgot-password", { email });
      setMessage(response.data.message || "If that email address is in our database, we will send you an email to reset your password.");
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="mx-auto mt-32 w-[400px] p-8">
      <h1 className="mb-2 text-2xl font-bold">Forgot Password</h1>
      <p className="mb-6 text-sm text-gray-500">
        Enter your admin email to receive a password reset link.
      </p>

      {message ? (
        <div className="space-y-4">
          <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm">
            {message}
          </div>
          <Button asChild className="w-full" variant="outline">
            <Link href="/login">Back to Login</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </Button>
          
          <div className="text-center mt-4">
            <Link href="/login" className="text-sm text-blue-600 hover:underline">
              Back to Login
            </Link>
          </div>
        </form>
      )}
    </Card>
  );
}
