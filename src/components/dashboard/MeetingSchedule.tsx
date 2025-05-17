
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  durationMinutes: number;
  type: "review" | "planning" | "other";
}

const MeetingSchedule: React.FC = () => {
  const meetings: Meeting[] = [
    {
      id: "meeting1",
      title: "Revisão de Design",
      date: "20/06/2025",
      time: "14:00",
      durationMinutes: 60,
      type: "review"
    },
    {
      id: "meeting2",
      title: "Planejamento Sprint 3",
      date: "25/06/2025",
      time: "10:00",
      durationMinutes: 90,
      type: "planning"
    },
    {
      id: "meeting3",
      title: "Apresentação de Resultados",
      date: "30/06/2025",
      time: "15:30",
      durationMinutes: 45,
      type: "other"
    }
  ];
  
  const getTypeLabel = (type: string) => {
    switch (type) {
      case "review":
        return "Revisão";
      case "planning":
        return "Planejamento";
      default:
        return "Reunião";
    }
  };
  
  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "review":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "planning":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-purple-100 text-purple-800 border-purple-200";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Próximos Encontros</CardTitle>
      </CardHeader>
      <CardContent>
        {meetings.length === 0 ? (
          <p className="text-sm text-center text-muted-foreground py-6">
            Nenhuma reunião agendada
          </p>
        ) : (
          <div className="space-y-4">
            {meetings.map((meeting) => (
              <div 
                key={meeting.id} 
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-md"
              >
                <div className="mb-2 sm:mb-0">
                  <p className="font-medium">{meeting.title}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Calendar className="h-3 w-3" />
                    <span>{meeting.date}</span>
                    <Clock className="h-3 w-3 ml-2" />
                    <span>{meeting.time} ({meeting.durationMinutes} min)</span>
                  </div>
                </div>
                
                <Badge 
                  variant="outline" 
                  className={`mt-2 sm:mt-0 ${getBadgeVariant(meeting.type)}`}
                >
                  {getTypeLabel(meeting.type)}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MeetingSchedule;
