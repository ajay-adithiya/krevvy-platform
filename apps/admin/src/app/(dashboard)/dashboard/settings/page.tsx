"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const [currentEmail, setCurrentEmail] = useState("");
  const [profileLoading, setProfileLoading] = useState(true);

  // Email state
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await api.get("/auth/profile");
        setCurrentEmail(response.data.email);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setProfileLoading(false);
      }
    }
    fetchProfile();
  }, []);

  async function handleEmailChange(e: React.FormEvent) {
    e.preventDefault();
    if (!newEmail || !emailPassword) return;

    setEmailLoading(true);
    setEmailError("");
    setEmailSuccess("");

    try {
      await api.patch("/auth/email", {
        newEmail,
        currentPassword: emailPassword,
      });
      setCurrentEmail(newEmail);
      setEmailSuccess("Email updated successfully.");
      setNewEmail("");
      setEmailPassword("");
    } catch (err: any) {
      setEmailError(err.response?.data?.message || "Failed to update email.");
    } finally {
      setEmailLoading(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) return;

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setPasswordLoading(true);
    setPasswordError("");
    setPasswordSuccess("");

    try {
      await api.patch("/auth/password", {
        currentPassword,
        newPassword,
      });
      
      setPasswordSuccess("Password updated successfully. Logging out...");
      
      // Clear forms
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Logout and redirect since all sessions were revoked
      setTimeout(() => {
        logout();
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || "Failed to update password.");
      setPasswordLoading(false);
    }
  }

  if (profileLoading) {
    return <div className="p-8">Loading profile...</div>;
  }

  return (
    <div className="space-y-8 p-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-gray-500 mt-2">Manage your admin account credentials.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Change Email</CardTitle>
        </CardHeader>
        <CardContent>
          {emailSuccess && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded text-sm">{emailSuccess}</div>}
          {emailError && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">{emailError}</div>}
          
          <form onSubmit={handleEmailChange} className="space-y-4">
            <div className="space-y-2">
              <Label>Current Email</Label>
              <Input value={currentEmail} disabled />
            </div>
            
            <div className="space-y-2">
              <Label>New Email</Label>
              <Input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input
                type="password"
                required
                value={emailPassword}
                onChange={(e) => setEmailPassword(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={emailLoading}>
              {emailLoading ? "Saving..." : "Update Email"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          {passwordSuccess && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded text-sm">{passwordSuccess}</div>}
          {passwordError && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">{passwordError}</div>}
          
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={passwordLoading}>
              {passwordLoading ? "Saving..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}