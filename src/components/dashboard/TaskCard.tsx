
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "inprogress" | "review" | "completed";
  checklist: ChecklistItem[];
  commentCount: number;
  onCommentClick: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  id,
  title,
  description,
  dueDate,
  priority,
  status,
  checklist,
  commentCount,
  onCommentClick,
}) => {
  const { toast } = useToast();
  const [items, setItems] = useState<ChecklistItem[]>(checklist);

  const completedItems = items.filter((item) => item.completed).length;
  const totalItems = items.length;
  const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  
  const handleCheckboxChange = (itemId: string) => {
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        const newState = !item.completed;
        
        // Show toast when marking complete
        if (newState) {
          toast({
            title: "Item completado",
            description: `${item.text} foi marcado como concluído`,
          });
        }
        
        return { ...item, completed: newState };
      }
      return item;
    });
    
    setItems(updatedItems);
  };
  
  const priorityColors = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-amber-100 text-amber-800",
    high: "bg-red-100 text-red-800",
  };

  return (
    <div className="task-card">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">{title}</h3>
        <Badge 
          variant="outline" 
          className={priorityColors[priority]}
        >
          {priority === "low" ? "Baixa" : priority === "medium" ? "Média" : "Alta"}
        </Badge>
      </div>
      
      <p className="text-sm text-muted-foreground mb-3">{description}</p>
      
      {dueDate && (
        <p className="text-xs text-muted-foreground mb-3">
          Data limite: {dueDate}
        </p>
      )}
      
      {items.length > 0 && (
        <div className="mb-4">
          <div className="text-xs font-medium mb-1 flex justify-between">
            <span>Checklist</span>
            <span>{completedItems}/{totalItems}</span>
          </div>
          
          <div className="h-1 w-full bg-gray-100 rounded">
            <div 
              className="h-1 bg-blue-500 rounded" 
              style={{ width: `${progress}%` }} 
            />
          </div>
          
          <div className="mt-2 space-y-1">
            {items.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center">
                <Checkbox 
                  id={`checkbox-${item.id}`}
                  checked={item.completed}
                  onCheckedChange={() => handleCheckboxChange(item.id)}
                  className="mr-2"
                />
                <label 
                  htmlFor={`checkbox-${item.id}`}
                  className={`text-xs ${item.completed ? "line-through text-muted-foreground" : ""}`}
                >
                  {item.text}
                </label>
              </div>
            ))}
            
            {items.length > 3 && (
              <p className="text-xs text-muted-foreground mt-1">
                +{items.length - 3} itens não exibidos
              </p>
            )}
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center mt-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs flex items-center gap-1 p-0 h-auto hover:bg-transparent hover:text-primary"
          onClick={onCommentClick}
        >
          <MessageSquare className="h-3 w-3" />
          <span>{commentCount} comentários</span>
        </Button>
      </div>
    </div>
  );
};

export default TaskCard;
