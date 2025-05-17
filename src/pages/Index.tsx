
import React from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import ProjectHeader from "../components/dashboard/ProjectHeader";
import ProjectStats from "../components/dashboard/ProjectStats";
import KanbanBoard from "../components/dashboard/KanbanBoard";
import MeetingSchedule from "../components/dashboard/MeetingSchedule";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        {isMobile && <SidebarTrigger />}
        <div>
          <h2 className="text-xl font-semibold">Painel do Cliente</h2>
          <p className="text-sm text-muted-foreground">
            Acompanhe o andamento do seu projeto
          </p>
        </div>
        {isMobile && <div className="w-9" />} {/* Spacer for layout balance */}
      </div>

      <Tabs defaultValue="website-redesign" className="mb-6">
        <TabsList>
          <TabsTrigger value="website-redesign">Redesign do Site</TabsTrigger>
          <TabsTrigger value="app-development">App Mobile</TabsTrigger>
        </TabsList>
        
        <TabsContent value="website-redesign">
          <ProjectHeader 
            title="Redesign do Site Corporativo" 
            client="ABC Tecnologia" 
            progress={65} 
          />
          
          <ProjectStats 
            startDate="01/05/2025"
            endDate="30/06/2025"
            budget="R$ 28.500,00"
            daysRemaining={14}
          />
          
          <KanbanBoard />
          
          <Separator className="my-8" />
          
          <MeetingSchedule />
        </TabsContent>
        
        <TabsContent value="app-development">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <h3 className="text-xl font-semibold mb-2">Projeto App Mobile</h3>
            <p className="text-muted-foreground mb-4">
              Este projeto ainda não foi iniciado.
            </p>
            <p className="text-sm">
              Data prevista para início: 01/07/2025
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Index;
