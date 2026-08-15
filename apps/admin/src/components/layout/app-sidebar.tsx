"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Settings,
  LogOut,
  ShoppingCart,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    url: "/dashboard/products",
    icon: Package,
  },
  {
    title: "Categories",
    url: "/dashboard/categories",
    icon: FolderTree,
  },
  {
    title: "Orders",
    url: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="text-xl font-bold px-4 py-5">
        Krevvy Admin
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>

          <SidebarGroupLabel>
            MENU
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>

              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>

                    <Link href={item.url}>
                      <item.icon size={18} />
                      <span>{item.title}</span>
                    </Link>

                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <SidebarMenuItem>

                <SidebarMenuButton>

                  <LogOut size={18} />
                  <span>Logout</span>

                </SidebarMenuButton>

              </SidebarMenuItem>

            </SidebarMenu>
          </SidebarGroupContent>

        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
