import React from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import ProjectHeader from "../components/dashboard/ProjectHeader";
import ProjectStats from "../components/dashboard/ProjectStats";
import MeetingSchedule from "../components/dashboard/MeetingSchedule";
import ProjectProgress from "../components/dashboard/ProjectProgress";
import { useIsMobile } from "@/hooks/use-mobile";
import ProjectSettings from "@/components/ProjectSettings";
import { useClickUpProject } from "@/hooks/use-clickup-project";

const Index = () => {
  const isMobile = useIsMobile();
  const { project } = useClickUpProject();

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Painel do Cliente</h2>
          <p className="text-sm text-muted-foreground">
            Acompanhe o andamento do seu projeto
          </p>
        </div>
        <ProjectSettings variant="icon" size="sm" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <ProjectHeader 
            title={project?.title || "Redesign do Site Corporativo"}
            client={project?.client || "ABC Tecnologia"} 
            progress={project?.progress || 65} 
          />
          
          <ProjectStats 
            startDate={project?.startDate || "01/05/2025"}
            endDate={project?.endDate || "30/06/2025"}
            budget={project?.budget || "R$ 28.500,00"}
            daysRemaining={project?.daysRemaining || 14}
          />
          
          <ProjectProgress />
        </div>
        
        <div className="lg:col-span-1">
          <MeetingSchedule />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
