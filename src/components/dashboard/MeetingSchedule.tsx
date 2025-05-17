
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

  // Ordenar reuniões por data
  const sortedMeetings = [...meetings].sort((a, b) => {
    const dateA = new Date(`${a.date.split('/').reverse().join('-')}T${a.time}`);
    const dateB = new Date(`${b.date.split('/').reverse().join('-')}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-primary" />
          Próximos Encontros
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedMeetings.length === 0 ? (
          <p className="text-sm text-center text-muted-foreground py-6">
            Nenhuma reunião agendada
          </p>
        ) : (
          <div className="space-y-4">
            {sortedMeetings.map((meeting) => (
              <div 
                key={meeting.id} 
                className="flex flex-col p-4 border rounded-md transition-all hover:shadow-md hover:border-primary/30"
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium">{meeting.title}</p>
                  <Badge 
                    variant="outline" 
                    className={getBadgeVariant(meeting.type)}
                  >
                    {getTypeLabel(meeting.type)}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1.5" />
                    <span>{meeting.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1.5" />
                    <span>{meeting.time} ({meeting.durationMinutes} min)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MeetingSchedule;
