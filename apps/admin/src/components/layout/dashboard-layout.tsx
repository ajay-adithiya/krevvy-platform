"use client";

import { SidebarProvider } from "@/components/ui/sidebar";

import { AppSidebar } from "./app-sidebar";
import AppHeader from "./app-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>

      <AppSidebar />

      <main className="flex-1">

        <AppHeader />

        <div className="p-6">
          {children}
        </div>

      </main>

    </SidebarProvider>
  );
}