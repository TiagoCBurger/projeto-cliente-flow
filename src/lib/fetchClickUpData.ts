import axios from 'axios';
import { useEffect, useState } from 'react';

// URL do webhook do ClickUp
const WEBHOOK_URL = 'https://webhook.burgdigital.site/webhook/85c3e223-f833-46d4-874a-ad63be6b1f94';

// Interfaces para tipagem
export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
}

export interface Comment {
  id: string;
  author: string;
  date: string;
  text: string;
}

export interface ProjectStage {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'pending';
  description: string;
  startDate: string;
  endDate: string;
  progress: number;
  subtasks: Subtask[];
  comments: Comment[];
}

export interface ProjectData {
  projectStages: ProjectStage[];
}

// Interface para mapear a resposta do ClickUp
interface ClickUpSubtask {
  id: string;
  name: string;
  status: string;
  due_date?: string | number;
}

interface ClickUpComment {
  id: string;
  text: string;
  date: string | number;
  user?: {
    id: string;
    name: string;
  };
}

interface ClickUpTask {
  id: string;
  name: string;
  description?: string;
  status: string;
  start_date?: string | number;
  due_date?: string | number;
  subtasks?: ClickUpSubtask[];
  comments?: ClickUpComment[];
}

interface ClickUpResponse {
  tasks: ClickUpTask[];
}

/**
 * Função para converter o status do ClickUp para o formato da nossa aplicação
 * @param clickupStatus - Status retornado pelo ClickUp
 * @returns Status no formato da nossa aplicação
 */
function mapStatus(clickupStatus: string): 'completed' | 'in-progress' | 'pending' {
  const statusMap: Record<string, 'completed' | 'in-progress' | 'pending'> = {
    'complete': 'completed',
    'in progress': 'in-progress',
    'to do': 'pending',
    'open': 'pending',
    'in review': 'in-progress',
    'closed': 'completed',
    'done': 'completed'
  };
  
  return statusMap[clickupStatus.toLowerCase()] || 'pending';
}

/**
 * Função para formatar a data no formato DD/MM/YYYY
 * @param dateString - Data em formato ISO ou timestamp
 * @returns Data formatada
 */
function formatDate(dateString?: string | number): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}

/**
 * Função para calcular o progresso baseado nas subtarefas
 * @param subtasks - Lista de subtarefas
 * @returns Percentual de progresso
 */
function calculateProgress(subtasks: Subtask[]): number {
  if (!subtasks || subtasks.length === 0) return 0;
  
  const completed = subtasks.filter(task => task.completed).length;
  return Math.round((completed / subtasks.length) * 100);
}

/**
 * Função principal para buscar dados do ClickUp e transformá-los
 */
export async function fetchClickUpData(): Promise<ProjectData | undefined> {
  try {
    console.log('Buscando dados do ClickUp...');
    
    // Fazendo a requisição para o webhook
    const response = await axios.get<ClickUpResponse>(WEBHOOK_URL);
    const clickupData = response.data;
    
    // Verificando se obtivemos dados
    if (!clickupData || !clickupData.tasks) {
      console.error('Nenhum dado de tarefa encontrado na resposta.');
      return undefined;
    }
    
    // Transformando dados do ClickUp para o formato da nossa aplicação
    const projectStages: ProjectStage[] = clickupData.tasks.map((task, index) => {
      // Convertendo subtarefas
      const subtasks: Subtask[] = task.subtasks ? task.subtasks.map((subtask, subIndex) => ({
        id: `subtask-${index}-${subIndex}`,
        title: subtask.name,
        completed: subtask.status === 'complete' || subtask.status === 'done',
        dueDate: formatDate(subtask.due_date)
      })) : [];
      
      // Convertendo comentários
      const comments: Comment[] = task.comments ? task.comments.map((comment, commentIndex) => ({
        id: `comment-${index}-${commentIndex}`,
        author: comment.user ? comment.user.name : 'Usuário',
        date: formatDate(comment.date),
        text: comment.text
      })) : [];
      
      // Criando objeto de etapa do projeto
      return {
        id: `phase-${index + 1}`,
        name: task.name,
        status: mapStatus(task.status),
        description: task.description || `Etapa ${index + 1} do projeto`,
        startDate: formatDate(task.start_date),
        endDate: formatDate(task.due_date),
        progress: calculateProgress(subtasks),
        subtasks,
        comments
      };
    });
    
    // Criando objeto final
    const formattedData: ProjectData = {
      projectStages
    };
    
    return formattedData;
    
  } catch (error) {
    console.error('Erro ao buscar dados do ClickUp:', error instanceof Error ? error.message : 'Erro desconhecido');
    if (axios.isAxiosError(error) && error.response) {
      console.error('Detalhes da resposta:', error.response.data);
    }
    return undefined;
  }
}

/**
 * Hook personalizado para buscar e gerenciar dados do ClickUp
 */
export function useClickUpData() {
  const [data, setData] = useState<ProjectData | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await fetchClickUpData();
        setData(result);
        setError(null);
      } catch (err) {
        setError("Erro ao carregar dados do ClickUp");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const refreshData = async () => {
    try {
      setLoading(true);
      const result = await fetchClickUpData();
      setData(result);
      setError(null);
      return true;
    } catch (err) {
      setError("Erro ao atualizar dados do ClickUp");
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  return { data, loading, error, refreshData };
} 