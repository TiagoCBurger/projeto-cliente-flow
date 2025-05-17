import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, ChevronRight, Calendar, CheckSquare, Square } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import CommentSection from "./CommentSection";

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
}

interface Checkpoint {
  id: string;
  name: string;
  status: "completed" | "in-progress" | "pending";
  description: string;
  startDate: string;
  endDate: string;
  progress: number;
  subtasks: Subtask[];
  comments: {
    id: string;
    author: string;
    date: string;
    text: string;
  }[];
}

const ProjectProgress = () => {
  // Dados de exemplo para os checkpoints do projeto
  const checkpoints: Checkpoint[] = [
    {
      id: "phase-1",
      name: "Planejamento",
      status: "completed",
      description: "Definição de escopo, objetivos, cronograma e recursos necessários para o projeto.",
      startDate: "01/05/2025",
      endDate: "10/05/2025",
      progress: 100,
      subtasks: [
        { id: "subtask-1", title: "Análise de requisitos", completed: true, dueDate: "03/05/2025" },
        { id: "subtask-2", title: "Definição do escopo", completed: true, dueDate: "05/05/2025" },
        { id: "subtask-3", title: "Elaboração do cronograma", completed: true, dueDate: "07/05/2025" },
        { id: "subtask-4", title: "Aprovação do cliente", completed: true, dueDate: "10/05/2025" }
      ],
      comments: [
        {
          id: "comment-1",
          author: "Tiago Burger",
          date: "05/05/2025",
          text: "Todos os documentos de planejamento foram aprovados pelo cliente."
        },
        {
          id: "comment-2",
          author: "Cliente",
          date: "10/05/2025",
          text: "Excelente trabalho na fase de planejamento, estamos confiantes no cronograma."
        }
      ]
    },
    {
      id: "phase-2",
      name: "Design",
      status: "completed",
      description: "Criação de wireframes, mockups e design final do site, incluindo identidade visual e experiência do usuário.",
      startDate: "11/05/2025",
      endDate: "25/05/2025",
      progress: 100,
      subtasks: [
        { id: "subtask-5", title: "Criação de wireframes", completed: true, dueDate: "15/05/2025" },
        { id: "subtask-6", title: "Design da interface", completed: true, dueDate: "20/05/2025" },
        { id: "subtask-7", title: "Revisão do cliente", completed: true, dueDate: "22/05/2025" },
        { id: "subtask-8", title: "Ajustes finais", completed: true, dueDate: "25/05/2025" }
      ],
      comments: [
        {
          id: "comment-3",
          author: "Designer",
          date: "20/05/2025",
          text: "Mockups finalizados e enviados para aprovação."
        },
        {
          id: "comment-4",
          author: "Cliente",
          date: "22/05/2025",
          text: "Adoramos o design! Apenas pequenos ajustes na paleta de cores."
        }
      ]
    },
    {
      id: "phase-3",
      name: "Desenvolvimento",
      status: "in-progress",
      description: "Codificação do frontend e backend do site, integração com sistemas existentes e configuração do ambiente.",
      startDate: "26/05/2025",
      endDate: "15/06/2025",
      progress: 60,
      subtasks: [
        { id: "subtask-9", title: "Configuração do ambiente", completed: true, dueDate: "28/05/2025" },
        { id: "subtask-10", title: "Desenvolvimento frontend", completed: true, dueDate: "06/06/2025" },
        { id: "subtask-11", title: "Desenvolvimento backend", completed: false, dueDate: "12/06/2025" },
        { id: "subtask-12", title: "Integração de APIs", completed: false, dueDate: "15/06/2025" }
      ],
      comments: [
        {
          id: "comment-5",
          author: "Desenvolvedor",
          date: "01/06/2025",
          text: "Frontend está 70% completo. Começando integração com API."
        }
      ]
    },
    {
      id: "phase-4",
      name: "Testes",
      status: "pending",
      description: "Testes de usabilidade, desempenho, compatibilidade e segurança para garantir a qualidade do site.",
      startDate: "16/06/2025",
      endDate: "23/06/2025",
      progress: 0,
      subtasks: [
        { id: "subtask-13", title: "Testes de usabilidade", completed: false, dueDate: "18/06/2025" },
        { id: "subtask-14", title: "Testes de desempenho", completed: false, dueDate: "20/06/2025" },
        { id: "subtask-15", title: "Testes de compatibilidade", completed: false, dueDate: "22/06/2025" },
        { id: "subtask-16", title: "Correção de bugs", completed: false, dueDate: "23/06/2025" }
      ],
      comments: []
    },
    {
      id: "phase-5",
      name: "Lançamento",
      status: "pending",
      description: "Implantação do site em produção, configuração final e treinamento da equipe do cliente.",
      startDate: "24/06/2025",
      endDate: "30/06/2025",
      progress: 0,
      subtasks: [
        { id: "subtask-17", title: "Preparação do ambiente de produção", completed: false, dueDate: "25/06/2025" },
        { id: "subtask-18", title: "Deploy em produção", completed: false, dueDate: "27/06/2025" },
        { id: "subtask-19", title: "Treinamento da equipe", completed: false, dueDate: "29/06/2025" },
        { id: "subtask-20", title: "Entrega final", completed: false, dueDate: "30/06/2025" }
      ],
      comments: []
    }
  ];

  const [selectedCheckpoint, setSelectedCheckpoint] = useState<Checkpoint | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calcular o progresso geral do projeto com base nos checkpoints
  const calculateOverallProgress = () => {
    const totalProgress = checkpoints.reduce((acc, checkpoint) => acc + checkpoint.progress, 0);
    return Math.round(totalProgress / checkpoints.length);
  };

  const overallProgress = calculateOverallProgress();

  const openCheckpointDetails = (checkpoint: Checkpoint) => {
    setSelectedCheckpoint(checkpoint);
    setIsModalOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-amber-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Concluído</Badge>;
      case "in-progress":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Em andamento</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Pendente</Badge>;
    }
  };

  return (
    <div className="space-y-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg">Progresso do Projeto</CardTitle>
          <div className="text-sm text-muted-foreground">
            {overallProgress}% concluído
          </div>
        </CardHeader>
        <CardContent>          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Etapas do Projeto</h3>
            
            <div className="space-y-3">
              {checkpoints.map((checkpoint) => (
                <div 
                  key={checkpoint.id}
                  className="flex items-center p-3 rounded-lg border hover:bg-muted cursor-pointer transition-colors"
                  onClick={() => openCheckpointDetails(checkpoint)}
                >
                  <div className="mr-3">
                    {getStatusIcon(checkpoint.status)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-medium">{checkpoint.name}</h4>
                      {getStatusBadge(checkpoint.status)}
                    </div>
                    
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>
                        {checkpoint.startDate} - {checkpoint.endDate}
                      </span>
                    </div>
                  </div>
                  
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedCheckpoint && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getStatusIcon(selectedCheckpoint.status)}
                <span>{selectedCheckpoint.name}</span>
              </DialogTitle>
              <DialogDescription className="flex justify-between items-center">
                <span>
                  {selectedCheckpoint.startDate} - {selectedCheckpoint.endDate}
                </span>
                {getStatusBadge(selectedCheckpoint.status)}
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="details">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Detalhes</TabsTrigger>
                <TabsTrigger value="comments">Comentários</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Descrição</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedCheckpoint.description}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Subtarefas</h4>
                  <div className="space-y-2 rounded-md p-3">
                    {selectedCheckpoint.subtasks.map((subtask) => (
                      <div key={subtask.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {subtask.completed ? (
                            <CheckSquare className="h-4 w-4 text-green-500" />
                          ) : (
                            <Square className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className={`text-sm ${subtask.completed ? "line-through text-muted-foreground" : ""}`}>
                            {subtask.title}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {subtask.dueDate}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Progresso</h4>
                  <div className="flex justify-between mb-1">
                    <p className="text-xs text-muted-foreground">Status atual</p>
                    <p className="text-xs font-medium">{selectedCheckpoint.progress}%</p>
                  </div>
                  <Progress value={selectedCheckpoint.progress} className="h-2" />
                </div>
              </TabsContent>
              
              <TabsContent value="comments">
                <CommentSection 
                  taskId={selectedCheckpoint.id}
                  comments={selectedCheckpoint.comments}
                />
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ProjectProgress;
