import { createClickUpAPI, ClickUpTask, ClickUpList } from './clickup-api';
import { aiProcessor } from './ai-processor';
import { Checkpoint, Project, ProjectSettingsOptions } from '@/types/project';

// Classe para gerenciar a integração com o ClickUp
export class ClickUpService {
  private api = createClickUpAPI();
  private settings: ProjectSettingsOptions;
  private cachedProject: Project | null = null;
  private lastFetch: number = 0;
  
  constructor(settings: ProjectSettingsOptions) {
    this.settings = settings;
  }
  
  // Atualiza as configurações do serviço
  updateSettings(settings: Partial<ProjectSettingsOptions>): void {
    this.settings = { ...this.settings, ...settings };
    // Invalidar o cache quando as configurações mudam
    this.cachedProject = null;
  }
  
  // Busca os dados do projeto a partir do ClickUp
  async fetchProjectData(forceRefresh = false): Promise<Project> {
    const now = Date.now();
    const refreshIntervalMs = this.settings.refreshInterval * 60 * 1000;
    
    // Verificar se podemos usar o cache
    if (
      !forceRefresh && 
      this.cachedProject && 
      now - this.lastFetch < refreshIntervalMs
    ) {
      console.log('Usando dados de projeto em cache');
      return this.cachedProject;
    }
    
    try {
      console.log('Buscando dados do projeto do ClickUp...');
      
      // Buscar dados do ClickUp
      const list = await this.api.getTaskDetails(this.settings.listId) as any as ClickUpList;
      const tasks = await this.api.getTasks(this.settings.listId);
      
      // Processar os dados com IA
      const checkpoints = await aiProcessor.interpretKanbanData(tasks, [list]);
      
      // Calcular o progresso geral
      const totalProgress = checkpoints.reduce((acc, cp) => acc + cp.progress, 0);
      const progress = checkpoints.length > 0 
        ? Math.round(totalProgress / checkpoints.length) 
        : 0;
      
      // Construir o objeto de projeto
      const project: Project = {
        id: list.id,
        title: list.name,
        client: 'Cliente IA', // Isso poderia ser extraído de um campo personalizado
        progress,
        checkpoints,
        startDate: checkpoints.length > 0 
          ? checkpoints[0].startDate 
          : new Date().toLocaleDateString('pt-BR'),
        endDate: checkpoints.length > 0 
          ? checkpoints[checkpoints.length - 1].endDate 
          : '',
        budget: 'R$ 28.500,00', // Poderia ser extraído de um campo personalizado
        daysRemaining: this.calculateDaysRemaining(
          checkpoints.length > 0 
            ? checkpoints[checkpoints.length - 1].endDate 
            : ''
        )
      };
      
      // Atualizar o cache
      this.cachedProject = project;
      this.lastFetch = now;
      
      return project;
    } catch (error) {
      console.error('Erro ao buscar dados do ClickUp:', error);
      throw new Error(`Falha ao buscar dados do projeto: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }
  
  // Calcula os dias restantes com base na data final
  private calculateDaysRemaining(endDateStr: string): number {
    if (!endDateStr) return 0;
    
    const parts = endDateStr.split('/');
    if (parts.length !== 3) return 0;
    
    const endDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    const today = new Date();
    
    // Normalizar as datas para remover as horas/minutos/segundos
    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  }
}

// Configurações padrão para o serviço
const defaultSettings: ProjectSettingsOptions = {
  teamId: import.meta.env.VITE_CLICKUP_TEAM_ID || '',
  spaceId: import.meta.env.VITE_CLICKUP_SPACE_ID || '',
  listId: import.meta.env.VITE_CLICKUP_LIST_ID || '',
  refreshInterval: 15 // 15 minutos
};

// Criar e exportar uma instância do serviço
export const clickUpService = new ClickUpService(defaultSettings); 