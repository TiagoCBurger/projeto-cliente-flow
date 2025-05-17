import React from "react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

interface ProjectHeaderProps {
  title: string;
  client: string;
  progress: number;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ 
  title, 
  client,
  progress 
}) => {
  const { toast } = useToast();

  const handleNotificationToggle = () => {
    toast({
      title: "Notificações ativadas",
      description: "Você receberá atualizações sobre este projeto via WhatsApp.",
    });
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">{title}</h1>
          <p className="text-muted-foreground mb-3">Cliente: {client}</p>
        </div>
        
        <div className="flex gap-2 mt-3 md:mt-0">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNotificationToggle}
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Ativar Notificações</span>
          </Button>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium">Progresso do projeto</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  );
};

export default ProjectHeader;
