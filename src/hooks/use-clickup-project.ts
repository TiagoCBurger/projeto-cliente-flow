import { useState, useEffect, useCallback } from 'react';
import { clickUpService } from '@/lib/clickup-service';
import { Project, ProjectSettingsOptions } from '@/types/project';

interface UseClickUpProjectResult {
  project: Project | null;
  loading: boolean;
  error: string | null;
  refreshProject: (force?: boolean) => Promise<void>;
  updateSettings: (settings: Partial<ProjectSettingsOptions>) => void;
}

export function useClickUpProject(): UseClickUpProjectResult {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Função para buscar os dados do projeto
  const fetchProjectData = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const projectData = await clickUpService.fetchProjectData(forceRefresh);
      setProject(projectData);
    } catch (err) {
      console.error("Erro ao buscar dados do projeto:", err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao buscar dados do projeto');
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Função para atualizar configurações
  const updateSettings = useCallback((settings: Partial<ProjectSettingsOptions>) => {
    clickUpService.updateSettings(settings);
    // Recarrega os dados com as novas configurações
    fetchProjectData(true);
  }, [fetchProjectData]);
  
  // Função exposta para forçar uma atualização
  const refreshProject = useCallback(async (force = true) => {
    await fetchProjectData(force);
  }, [fetchProjectData]);
  
  // Carregar os dados do projeto na montagem do componente
  useEffect(() => {
    fetchProjectData();
    
    // Opcionalmente, configurar um intervalo para atualização periódica
    const intervalId = setInterval(() => {
      fetchProjectData();
    }, 5 * 60 * 1000); // A cada 5 minutos
    
    return () => clearInterval(intervalId);
  }, [fetchProjectData]);
  
  return {
    project,
    loading,
    error,
    refreshProject,
    updateSettings
  };
} 