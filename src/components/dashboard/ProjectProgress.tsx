import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, ChevronRight, Calendar, CheckSquare, Square, RefreshCw } from "lucide-react";
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
import { useClickUpData, ProjectStage } from "@/lib/fetchClickUpData";
import { useToast } from "@/components/ui/use-toast";

const ProjectProgress = () => {
  const { data, loading, error, refreshData } = useClickUpData();
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<ProjectStage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  // Usar dados vindos do ClickUp ou fallback para dados locais quando não disponíveis
  const checkpoints = data?.projectStages || [];

  // Calcular o progresso geral do projeto com base nos checkpoints
  const calculateOverallProgress = () => {
    if (checkpoints.length === 0) return 0;
    const totalProgress = checkpoints.reduce((acc, checkpoint) => acc + checkpoint.progress, 0);
    return Math.round(totalProgress / checkpoints.length);
  };

  const overallProgress = calculateOverallProgress();

  const openCheckpointDetails = (checkpoint: ProjectStage) => {
    setSelectedCheckpoint(checkpoint);
    setIsModalOpen(true);
  };

  const handleRefreshData = async () => {
    const success = await refreshData();
    if (success) {
      toast({
        title: "Dados atualizados",
        description: "Informações do projeto foram atualizadas com sucesso.",
      });
    } else {
      toast({
        title: "Erro na atualização",
        description: "Não foi possível atualizar as informações. Tente novamente.",
        variant: "destructive",
      });
    }
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

  if (loading) {
    return (
      <div className="space-y-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg">Progresso do Projeto</CardTitle>
            <div className="text-sm text-muted-foreground">Carregando...</div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg">Progresso do Projeto</CardTitle>
            <Button size="sm" variant="outline" onClick={handleRefreshData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Não foi possível carregar as informações do projeto.</p>
              <p className="text-sm">Verifique sua conexão e tente novamente.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (checkpoints.length === 0) {
    return (
      <div className="space-y-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg">Progresso do Projeto</CardTitle>
            <Button size="sm" variant="outline" onClick={handleRefreshData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Nenhuma etapa encontrada para este projeto.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg">Progresso do Projeto</CardTitle>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {overallProgress}% concluído
            </div>
            <Button size="sm" variant="outline" onClick={handleRefreshData} className="h-8 px-2">
              <RefreshCw className="h-4 w-4" />
            </Button>
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
