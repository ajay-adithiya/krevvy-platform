'use client';

import React, { useState } from 'react';
import { useAuthStore } from '../../store/auth.store';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setTokens = useAuthStore((state) => state.setTokens);

  if (!isOpen) return null;

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/customers/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to request OTP');
      }

      setStep('verify');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/customers/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Invalid or expired OTP');
      }

      const response = await res.json();
      const accessToken = response.data.accessToken;

      setTokens({ accessToken });

      // Fetch profile
      const profileRes = await fetch(`${API_BASE_URL}/customers/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });

      if (profileRes.ok) {
        const profile = await profileRes.json();
        useAuthStore.getState().setUser(profile);
      }

      onClose();
      // Reset for next time
      setTimeout(() => {
        setStep('request');
        setEmail('');
        setOtp('');
      }, 300);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {step === 'request' ? 'Sign In / Register' : 'Enter Verification Code'}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {step === 'request'
            ? 'Enter your email to receive a secure login code.'
            : `We sent a 6-digit code to ${email}`}
        </p>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {step === 'request' ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Continue with Email'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Verification Code
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                maxLength={6}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-center text-2xl tracking-widest shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="000000"
              />
            </div>
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <button
              type="button"
              onClick={() => setStep('request')}
              className="w-full text-center text-sm text-indigo-600 hover:text-indigo-500"
            >
              Use a different email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
