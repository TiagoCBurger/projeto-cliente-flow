
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, DollarSign } from "lucide-react";
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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
        <CardContent className="p-4">
          <div className="flex items-start">
            <div className="p-2 rounded-md bg-blue-100 text-blue-700 mr-3">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Data de início
              </p>
              <p className="text-base font-semibold">{startDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
        <CardContent className="p-4">
          <div className="flex items-start">
            <div className="p-2 rounded-md bg-indigo-100 text-indigo-700 mr-3">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Data de conclusão
              </p>
              <p className="text-base font-semibold">{endDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100">
        <CardContent className="p-4">
          <div className="flex items-start">
            <div className="p-2 rounded-md bg-emerald-100 text-emerald-700 mr-3">
              <DollarSign className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Orçamento
              </p>
              <p className="text-base font-semibold">{budget}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className={`bg-gradient-to-br ${daysRemaining < 10 ? 'from-amber-50 to-white border-amber-100' : 'from-violet-50 to-white border-violet-100'}`}>
        <CardContent className="p-4">
          <div className="flex items-start">
            <div className={`p-2 rounded-md ${daysRemaining < 10 ? 'bg-amber-100 text-amber-700' : 'bg-violet-100 text-violet-700'} mr-3`}>
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Dias restantes
              </p>
              <p className={`text-base font-semibold ${daysRemaining < 10 ? "text-amber-700" : ""}`}>
                {daysRemaining} dias
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectStats;
