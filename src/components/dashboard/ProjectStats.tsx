
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProjectStatsProps {
  startDate: string;
  endDate: string;
  budget: string;
  daysRemaining: number;
}

const ProjectStats: React.FC<ProjectStatsProps> = ({
  startDate,
  endDate,
  budget,
  daysRemaining
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Data de início
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-primary" />
          <span className="text-lg font-semibold">{startDate}</span>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Data de conclusão
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-primary" />
          <span className="text-lg font-semibold">{endDate}</span>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Orçamento aprovado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-lg font-semibold">{budget}</span>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Dias restantes
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-primary" />
          <span className={`text-lg font-semibold ${daysRemaining < 10 ? "text-orange-500" : ""}`}>
            {daysRemaining} dias
          </span>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectStats;
