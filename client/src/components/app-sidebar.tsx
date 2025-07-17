import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  ArrowLeftRight,
  BookOpen,
  LayoutDashboard,
  Settings,
  Tag,
  UserCog,
  Users,
} from "lucide-react";
import { Link } from "react-router";

const data = {
  user: {
    name: "Library Admin",
    email: "admin@library.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Books",
      url: "/books",
      icon: BookOpen,
    },
    {
      title: "Members",
      url: "/members",
      icon: Users,
    },
    {
      title: "Borrowings",
      url: "/borrowings",
      icon: ArrowLeftRight,
    },
    {
      title: "Genres",
      url: "/genres",
      icon: Tag,
    },
    {
      title: "Staff",
      url: "/staff",
      icon: UserCog,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/">
                <BookOpen className="!size-5" />
                <span className="text-base font-semibold">Library.</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
