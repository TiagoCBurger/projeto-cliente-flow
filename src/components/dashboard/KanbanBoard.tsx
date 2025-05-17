
import React, { useState } from "react";
import TaskCard from "./TaskCard";
import CommentSection from "./CommentSection";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "inprogress" | "review" | "completed";
  checklist: ChecklistItem[];
  comments: { id: string; author: string; date: string; text: string }[];
}

const KanbanBoard: React.FC = () => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  
  const mockTasks: Task[] = [
    {
      id: "task1",
      title: "Levantamento de requisitos",
      description: "Reunir todas as informações necessárias para o projeto",
      dueDate: "10/06/2025",
      priority: "high",
      status: "completed",
      checklist: [
        { id: "check1", text: "Entrevista com stakeholders", completed: true },
        { id: "check2", text: "Documentar requisitos funcionais", completed: true },
        { id: "check3", text: "Validar com o cliente", completed: true },
      ],
      comments: [
        { 
          id: "comment1", 
          author: "João Silva", 
          date: "05/06/2025", 
          text: "Todos os requisitos foram documentados e validados pelo cliente." 
        }
      ]
    },
    {
      id: "task2",
      title: "Design de interface",
      description: "Criação de wireframes e protótipos",
      dueDate: "15/06/2025",
      priority: "medium",
      status: "inprogress",
      checklist: [
        { id: "check4", text: "Wireframes das páginas principais", completed: true },
        { id: "check5", text: "Protótipo de alta fidelidade", completed: false },
        { id: "check6", text: "Design system", completed: false },
      ],
      comments: [
        { 
          id: "comment2", 
          author: "Maria Oliveira", 
          date: "12/06/2025", 
          text: "Os wireframes foram aprovados. Iniciando o protótipo de alta fidelidade." 
        }
      ]
    },
    {
      id: "task3",
      title: "Desenvolvimento frontend",
      description: "Implementação da interface do usuário",
      dueDate: "25/06/2025",
      priority: "medium",
      status: "todo",
      checklist: [
        { id: "check7", text: "Configuração do ambiente", completed: false },
        { id: "check8", text: "Desenvolvimento de componentes", completed: false },
        { id: "check9", text: "Integração com API", completed: false },
      ],
      comments: []
    },
    {
      id: "task4",
      title: "Revisão de design",
      description: "Validação dos elementos visuais pelo cliente",
      dueDate: "18/06/2025",
      priority: "low",
      status: "review",
      checklist: [
        { id: "check10", text: "Apresentação para o cliente", completed: true },
        { id: "check11", text: "Coletar feedback", completed: false },
        { id: "check12", text: "Implementar ajustes", completed: false },
      ],
      comments: [
        { 
          id: "comment3", 
          author: "Carlos Mendes", 
          date: "17/06/2025", 
          text: "Design apresentado ao cliente. Aguardando feedback final." 
        }
      ]
    },
    {
      id: "task5",
      title: "Testes de usabilidade",
      description: "Avaliação da experiência do usuário",
      priority: "low",
      status: "todo",
      checklist: [
        { id: "check13", text: "Selecionar participantes", completed: false },
        { id: "check14", text: "Preparar roteiro de teste", completed: false },
        { id: "check15", text: "Realizar testes", completed: false },
      ],
      comments: []
    }
  ];

  const handleOpenComments = (task: Task) => {
    setActiveTask(task);
    setIsCommentOpen(true);
  };

  const handleCloseComments = () => {
    setIsCommentOpen(false);
  };
  
  const todoTasks = mockTasks.filter(task => task.status === "todo");
  const inProgressTasks = mockTasks.filter(task => task.status === "inprogress");
  const reviewTasks = mockTasks.filter(task => task.status === "review");
  const completedTasks = mockTasks.filter(task => task.status === "completed");

  return (
    <>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Progresso do Projeto</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="kanban-column bg-kanban-todo">
            <h3 className="font-medium mb-4">A Fazer ({todoTasks.length})</h3>
            {todoTasks.map((task) => (
              <TaskCard
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description}
                dueDate={task.dueDate}
                priority={task.priority}
                status={task.status}
                checklist={task.checklist}
                commentCount={task.comments.length}
                onCommentClick={() => handleOpenComments(task)}
              />
            ))}
          </div>
          
          <div className="kanban-column bg-kanban-inprogress">
            <h3 className="font-medium mb-4">Em Andamento ({inProgressTasks.length})</h3>
            {inProgressTasks.map((task) => (
              <TaskCard
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description}
                dueDate={task.dueDate}
                priority={task.priority}
                status={task.status}
                checklist={task.checklist}
                commentCount={task.comments.length}
                onCommentClick={() => handleOpenComments(task)}
              />
            ))}
          </div>
          
          <div className="kanban-column bg-kanban-review">
            <h3 className="font-medium mb-4">Revisão ({reviewTasks.length})</h3>
            {reviewTasks.map((task) => (
              <TaskCard
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description}
                dueDate={task.dueDate}
                priority={task.priority}
                status={task.status}
                checklist={task.checklist}
                commentCount={task.comments.length}
                onCommentClick={() => handleOpenComments(task)}
              />
            ))}
          </div>
          
          <div className="kanban-column bg-kanban-completed">
            <h3 className="font-medium mb-4">Concluído ({completedTasks.length})</h3>
            {completedTasks.map((task) => (
              <TaskCard
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description}
                dueDate={task.dueDate}
                priority={task.priority}
                status={task.status}
                checklist={task.checklist}
                commentCount={task.comments.length}
                onCommentClick={() => handleOpenComments(task)}
              />
            ))}
          </div>
        </div>
      </div>
      
      <Dialog open={isCommentOpen} onOpenChange={handleCloseComments}>
        <DialogContent className="sm:max-w-lg">
          {activeTask && (
            <Tabs defaultValue="comments">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Detalhes</TabsTrigger>
                <TabsTrigger value="comments">Comentários</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{activeTask.title}</h2>
                  <p className="text-sm text-muted-foreground mb-4">{activeTask.description}</p>
                  
                  {activeTask.dueDate && (
                    <div className="mb-4">
                      <p className="text-sm font-medium">Data limite</p>
                      <p className="text-sm">{activeTask.dueDate}</p>
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-1">Checklist</p>
                    <div className="space-y-2">
                      {activeTask.checklist.map((item) => (
                        <div key={item.id} className="flex items-center">
                          <Checkbox
                            id={`dialog-checkbox-${item.id}`}
                            checked={item.completed}
                            className="mr-2"
                            disabled
                          />
                          <label
                            htmlFor={`dialog-checkbox-${item.id}`}
                            className={`text-sm ${item.completed ? "line-through text-muted-foreground" : ""}`}
                          >
                            {item.text}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="comments">
                <CommentSection 
                  taskId={activeTask.id}
                  comments={activeTask.comments}
                />
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default KanbanBoard;
