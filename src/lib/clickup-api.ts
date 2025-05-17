// Interfaces para os tipos de dados do ClickUp
export interface ClickUpSpace {
  id: string;
  name: string;
}

export interface ClickUpList {
  id: string;
  name: string;
  status: {
    status: string;
    color: string;
    type: string;
  };
}

export interface ClickUpTask {
  id: string;
  name: string;
  description: string;
  status: {
    status: string;
    color: string;
    type: string;
  };
  date_created: string;
  date_updated: string;
  date_closed: string | null;
  due_date: string | null;
  start_date: string | null;
  time_estimate: number | null;
  time_spent: number | null;
  assignees: {
    id: number;
    username: string;
    email: string;
    profilePicture: string | null;
  }[];
  custom_fields: any[];
  comments: {
    id: string;
    text: string;
    user: {
      id: number;
      username: string;
      email: string;
    };
    date: string;
  }[];
  checklists: {
    id: string;
    name: string;
    items: {
      id: string;
      name: string;
      resolved: boolean;
      date: string;
    }[];
  }[];
}

export interface ClickUpFolder {
  id: string;
  name: string;
  lists: ClickUpList[];
}

export interface ClickUpProjectData {
  spaces: ClickUpSpace[];
  folders: ClickUpFolder[];
  lists: ClickUpList[];
  tasks: ClickUpTask[];
}

// Classe para gerenciar a API do ClickUp
export class ClickUpAPI {
  private apiKey: string;
  private baseUrl: string = 'https://api.clickup.com/api/v2';
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = {
      'Authorization': this.apiKey,
      'Content-Type': 'application/json'
    };
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        ...headers
      }
    });
    
    if (!response.ok) {
      throw new Error(`ClickUp API Error: ${response.status} ${response.statusText}`);
    }
    
    return response.json() as Promise<T>;
  }
  
  // Buscar espaços de trabalho
  async getSpaces(teamId: string): Promise<ClickUpSpace[]> {
    const response = await this.fetch<{spaces: ClickUpSpace[]}>(`/team/${teamId}/space`);
    return response.spaces;
  }
  
  // Buscar pastas de um espaço
  async getFolders(spaceId: string): Promise<ClickUpFolder[]> {
    const response = await this.fetch<{folders: ClickUpFolder[]}>(`/space/${spaceId}/folder`);
    return response.folders;
  }
  
  // Buscar listas (boards) de uma pasta
  async getLists(folderId: string): Promise<ClickUpList[]> {
    const response = await this.fetch<{lists: ClickUpList[]}>(`/folder/${folderId}/list`);
    return response.lists;
  }
  
  // Buscar listas (boards) de um espaço diretamente
  async getListsFromSpace(spaceId: string): Promise<ClickUpList[]> {
    const response = await this.fetch<{lists: ClickUpList[]}>(`/space/${spaceId}/list`);
    return response.lists;
  }
  
  // Buscar tarefas de uma lista
  async getTasks(listId: string): Promise<ClickUpTask[]> {
    const response = await this.fetch<{tasks: ClickUpTask[]}>(`/list/${listId}/task`);
    return response.tasks;
  }
  
  // Buscar detalhes de uma tarefa específica
  async getTaskDetails(taskId: string): Promise<ClickUpTask> {
    return this.fetch<ClickUpTask>(`/task/${taskId}`);
  }
}

// Criar uma instância da API com base na chave da API armazenada no ambiente
export const createClickUpAPI = () => {
  const apiKey = import.meta.env.VITE_CLICKUP_API_KEY;
  
  if (!apiKey) {
    console.error('ClickUp API Key não encontrada. Configure a variável de ambiente VITE_CLICKUP_API_KEY');
    throw new Error('ClickUp API Key não configurada');
  }
  
  return new ClickUpAPI(apiKey);
};

export default createClickUpAPI; 