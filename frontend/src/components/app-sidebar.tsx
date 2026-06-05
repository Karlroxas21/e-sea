import { 
  House, 
  FileText, 
  ShieldCheck, 
  Anchor, 
  Briefcase,
  GraduationCap,
  ClipboardCheck,
  BookOpen,
  FolderOpen,
  Newspaper,
  Settings,
  LogOut,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"

import UTSLogo from "@/assets/UTS.png"

const mainNavItems = [
  { title: "Dashboard", url: "/dashboard", icon: House, isActive: true },
  { title: "My Requirements", url: "/requirements", icon: FileText, badge: "5" },
  { title: "Compliance", url: "/compliance", icon: ShieldCheck },
  { title: "Assignments", url: "/assignments", icon: Anchor },
  { title: "Jobs", url: "/jobs", icon: Briefcase },
]

const activityNavItems = [
  { title: "Training", url: "/training", icon: GraduationCap },
  { title: "Assessments", url: "/assessments", icon: ClipboardCheck },
  { title: "Logbook", url: "/logbook", icon: BookOpen },
  { title: "Documents", url: "/documents", icon: FolderOpen },
  { title: "News", url: "/news", icon: Newspaper },
]

export function AppSidebar() {
  const handleSignOut = async () => {
    try {
      const baseUrl = window.location.origin 
      
      const response = await fetch(`${baseUrl}/v1/api/auth/logout`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to cleanly terminate server session wrapper.")
      }

      localStorage.clear()
      window.location.href = ""
    } catch (error) {
      console.error("Sign out process failed:", error)
      window.location.href = "/"
    }
  }

  return (
    <Sidebar collapsible="none" className="border-y-0 border-slate-300">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <img src={UTSLogo} alt="UTS Logo" className="h-10 w-auto object-contain" />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest font-bold text-slate-400 px-4 mb-2">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={`h-9 px-4 rounded-md transition-colors ${
                      item.isActive 
                        ? "bg-[#0B2545] text-white hover:bg-[#0B2545] hover:text-white" 
                        : "text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    <a href={item.url} className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span className="text-sm font-medium">{item.title}</span>
                      </div>
                      {item.badge && (
                        <span className="bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest font-bold text-slate-400 px-4 mb-2">
            Activities
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {activityNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className="h-9 px-4 text-slate-500 hover:bg-slate-100 rounded-md"
                  >
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-slate-300">
        <div className="flex items-center justify-between w-full px-2">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-[#0B2545] flex items-center justify-center text-white text-xs font-bold">
              DS
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900 leading-tight">Darryl Serdon</span>
              <span className="text-[10px] text-slate-500 font-medium">Demo 1</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer rounded-md hover:bg-slate-50 transition-colors">
              <Settings className="h-4 w-4" />
            </button>
            <button 
              onClick={handleSignOut}
              className="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-red-600 cursor-pointer rounded-md hover:bg-red-50 transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}