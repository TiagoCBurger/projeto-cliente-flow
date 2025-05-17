
import React from "react";
import { 
  Sidebar as SidebarComponent, 
  SidebarContent, 
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarHeader
} from "@/components/ui/sidebar";
import { Calendar, FileText, MessageSquare, Settings, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const navigationItems = [
  {
    title: "Dashboard",
    icon: FileText,
    url: "#",
    active: true
  },
  {
    title: "Reuniões",
    icon: Calendar,
    url: "#",
    active: false
  },
  {
    title: "Comunicações",
    icon: MessageSquare,
    url: "#",
    active: false
  },
  {
    title: "Equipe",
    icon: Users,
    url: "#",
    active: false
  },
  {
    title: "Configurações",
    icon: Settings,
    url: "#",
    active: false
  }
];

const Sidebar: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <SidebarComponent>
      <SidebarHeader className="py-6">
        <div className="px-4 flex items-center gap-2">
          <span className="font-bold text-xl">Área do Cliente</span>
          {!isMobile && <SidebarTrigger />}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={cn(
                    item.active && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  )}>
                    <a href={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      {isMobile && (
        <div className="fixed bottom-4 right-4 z-40">
          <SidebarTrigger />
        </div>
      )}
    </SidebarComponent>
  );
};

export default Sidebar;
