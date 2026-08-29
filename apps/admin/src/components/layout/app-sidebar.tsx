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
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";

const websiteItems = [
  { title: "Global", url: "/dashboard/website/global" },
  { title: "Home", url: "/dashboard/website/home" },
  { title: "Products Page", url: "/dashboard/website/products" },
  { title: "About", url: "/dashboard/website/about" },
  { title: "Contact", url: "/dashboard/website/contact" },
  { title: "FAQ", url: "/dashboard/website/faq" },
  { title: "Navigation", url: "/dashboard/website/navigation" },
  { title: "Footer", url: "/dashboard/website/footer" },
  { title: "Media", url: "/dashboard/website/media" },
];

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
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      logout();
      router.push("/login");
    }
  };

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

                <SidebarMenuButton onClick={handleLogout}>

                  <LogOut size={18} />
                  <span>Logout</span>

                </SidebarMenuButton>

              </SidebarMenuItem>

            </SidebarMenu>
          </SidebarGroupContent>

        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>WEBSITE CMS</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuSub>
                  {websiteItems.map((item) => (
                    <SidebarMenuSubItem key={item.title}>
                      <SidebarMenuSubButton asChild>
                        <Link href={item.url}>
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
