import { Home, Users, DoorOpen, FileText, Download, CreditCard, Settings, Bell, Database } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Student Management", url: "/students", icon: Users },
  { title: "Room Allocation", url: "/rooms", icon: DoorOpen },
  { title: "Requests & Changes", url: "/requests", icon: Bell },
  { title: "Vacancy Report", url: "/vacancy", icon: FileText },
  { title: "Export Data", url: "/export", icon: Download },
  { title: "Payment Status", url: "/payments", icon: CreditCard },
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Seed Database", url: "/seed-database", icon: Database },
];

export function AppSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarContent>
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            HRAS
          </h1>
          <p className="text-xs text-muted-foreground mt-1">Hostel Room System</p>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground px-4 py-3">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                          isActive
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-sidebar-accent text-sidebar-foreground"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
