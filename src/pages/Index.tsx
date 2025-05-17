import React from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import ProjectHeader from "../components/dashboard/ProjectHeader";
import ProjectStats from "../components/dashboard/ProjectStats";
import MeetingSchedule from "../components/dashboard/MeetingSchedule";
import ProjectProgress from "../components/dashboard/ProjectProgress";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Painel do Cliente</h2>
          <p className="text-sm text-muted-foreground">
            Acompanhe o andamento do seu projeto
          </p>
        </div>
        {isMobile && <div className="w-9" />} {/* Spacer for layout balance */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
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
