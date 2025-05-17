import { ClickUpTask, ClickUpList } from './clickup-api';
import { Checkpoint, Subtask } from '@/types/project';

// Interface para o serviço de IA
export interface AIService {
  interpretKanbanData(tasks: ClickUpTask[], lists: ClickUpList[]): Promise<Checkpoint[]>;
  translateTaskToCheckpoint(task: ClickUpTask): Promise<Checkpoint>;
  extractSubtasksFromChecklists(task: ClickUpTask): Subtask[];
  estimateProgressFromStatus(task: ClickUpTask): number;
}

// Classe concreta para processamento de IA simples
export class SimpleAIProcessor implements AIService {
  /**
   * Interpreta os dados do Kanban do ClickUp e transforma em checkpoints do projeto
   */
  async interpretKanbanData(tasks: ClickUpTask[], lists: ClickUpList[]): Promise<Checkpoint[]> {
    console.log('Processando dados do Kanban com IA...');
    
    // Mapeamento básico de status para nosso formato
    const statusMap: Record<string, "completed" | "in-progress" | "pending"> = {
      "Concluído": "completed",
      "Completed": "completed",
      "Done": "completed",
      "Em andamento": "in-progress",
      "In Progress": "in-progress",
      "Pendente": "pending",
      "To Do": "pending",
      "Blocked": "pending"
    };
    
    // Transformar cada tarefa em um checkpoint
    const checkpoints = await Promise.all(
      tasks.map(task => this.translateTaskToCheckpoint(task, statusMap))
    );
    
    return checkpoints.sort((a, b) => {
      // Ordene por data de início se disponível
      if (a.startDate && b.startDate) {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      }
      return 0;
    });
  }
  
  /**
   * Converte uma tarefa do ClickUp em um checkpoint do projeto
   */
  async translateTaskToCheckpoint(
    task: ClickUpTask, 
    statusMap: Record<string, "completed" | "in-progress" | "pending"> = {}
  ): Promise<Checkpoint> {
    // Determinar o status da tarefa
    const taskStatus = task.status.status || "To Do";
    const mappedStatus = statusMap[taskStatus] || "pending";
    
    // Calcular o progresso baseado no status e checklists
    const progress = this.estimateProgressFromStatus(task);
    
    // Extrair subtarefas dos checklists
    const subtasks = this.extractSubtasksFromChecklists(task);
    
    // Extrair comentários
    const comments = task.comments?.map(comment => ({
      id: comment.id,
      author: comment.user?.username || 'Usuário',
      date: this.formatDate(comment.date),
      text: comment.text
    })) || [];
    
    // Formatar datas
    const startDate = task.start_date 
      ? this.formatDate(task.start_date) 
      : this.formatDate(task.date_created);
      
    const endDate = task.due_date 
      ? this.formatDate(task.due_date) 
      : '';
    
    return {
      id: task.id,
      name: task.name,
      status: mappedStatus,
      description: task.description || '',
      startDate,
      endDate,
      progress,
      subtasks,
      comments
    };
  }
  
  /**
   * Extrai subtarefas dos checklists do ClickUp
   */
  extractSubtasksFromChecklists(task: ClickUpTask): Subtask[] {
    const subtasks: Subtask[] = [];
    
    // Processar todos os checklists da tarefa
    if (task.checklists && task.checklists.length > 0) {
      task.checklists.forEach(checklist => {
        if (checklist.items && checklist.items.length > 0) {
          checklist.items.forEach(item => {
            subtasks.push({
              id: item.id,
              title: item.name,
              completed: item.resolved,
              dueDate: task.due_date ? this.formatDate(task.due_date) : ''
            });
          });
        }
      });
    }
    
    return subtasks;
  }
  
  /**
   * Estima o progresso da tarefa com base no status e nos checklists
   */
  estimateProgressFromStatus(task: ClickUpTask): number {
    // Se a tarefa estiver completa, retorne 100%
    if (task.status.status === 'Concluído' || 
        task.status.status === 'Completed' || 
        task.status.status === 'Done') {
      return 100;
    }
    
    // Se a tarefa estiver bloqueada ou pendente, retorne 0%
    if (task.status.status === 'Pendente' || 
        task.status.status === 'To Do' || 
        task.status.status === 'Blocked') {
      return 0;
    }
    
    // Se há checklists, calcule o progresso baseado nos itens resolvidos
    if (task.checklists && task.checklists.length > 0) {
      let totalItems = 0;
      let resolvedItems = 0;
      
      task.checklists.forEach(checklist => {
        if (checklist.items && checklist.items.length > 0) {
          totalItems += checklist.items.length;
          resolvedItems += checklist.items.filter(item => item.resolved).length;
        }
      });
      
      if (totalItems > 0) {
        return Math.round((resolvedItems / totalItems) * 100);
      }
    }
    
    // Para tarefas em andamento sem checklists, retorne 50%
    return 50;
  }
  
  /**
   * Formata uma data timestamp para o formato DD/MM/YYYY
   */
  private formatDate(dateString: string): string {
    if (!dateString) return '';
    
    // Converter para milissegundos se for um timestamp em segundos
    let timestamp = parseInt(dateString);
    if (timestamp < 1000000000000) {
      timestamp *= 1000; // Converter segundos para milissegundos
    }
    
    const date = new Date(timestamp);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}

// Instância do serviço de IA para uso na aplicação
export const aiProcessor = new SimpleAIProcessor(); 