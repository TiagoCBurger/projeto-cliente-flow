const axios = require('axios');
const fs = require('fs');
const path = require('path');

// URL do webhook do ClickUp
const WEBHOOK_URL = 'https://webhook.burgdigital.site/webhook/85c3e223-f833-46d4-874a-ad63be6b1f94';

/**
 * Função para converter o status do ClickUp para o formato da nossa aplicação
 * @param {string} clickupStatus - Status retornado pelo ClickUp
 * @returns {string} - Status no formato da nossa aplicação
 */
function mapStatus(clickupStatus) {
  const statusMap = {
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
 * @param {string} dateString - Data em formato ISO ou timestamp
 * @returns {string} - Data formatada
 */
function formatDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}

/**
 * Função para calcular o progresso baseado nas subtarefas
 * @param {Array} subtasks - Lista de subtarefas
 * @returns {number} - Percentual de progresso
 */
function calculateProgress(subtasks) {
  if (!subtasks || subtasks.length === 0) return 0;
  
  const completed = subtasks.filter(task => task.completed).length;
  return Math.round((completed / subtasks.length) * 100);
}

/**
 * Função principal para buscar dados do ClickUp e transformá-los
 */
async function fetchClickUpData() {
  try {
    console.log('Buscando dados do ClickUp...');
    
    // Fazendo a requisição para o webhook
    const response = await axios.get(WEBHOOK_URL);
    const clickupData = response.data;
    
    // Verificando se obtivemos dados
    if (!clickupData || !clickupData.tasks) {
      console.error('Nenhum dado de tarefa encontrado na resposta.');
      return;
    }
    
    // Transformando dados do ClickUp para o formato da nossa aplicação
    const projectStages = clickupData.tasks.map((task, index) => {
      // Convertendo subtarefas
      const subtasks = task.subtasks ? task.subtasks.map((subtask, subIndex) => ({
        id: `subtask-${index}-${subIndex}`,
        title: subtask.name,
        completed: subtask.status === 'complete' || subtask.status === 'done',
        dueDate: formatDate(subtask.due_date)
      })) : [];
      
      // Convertendo comentários
      const comments = task.comments ? task.comments.map((comment, commentIndex) => ({
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
    const formattedData = {
      projectStages
    };
    
    // Salvando o resultado em um arquivo JSON
    const outputPath = path.join(__dirname, '..', 'data', 'projectStages.json');
    
    // Garantindo que o diretório existe
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    
    // Salvando o arquivo
    fs.writeFileSync(outputPath, JSON.stringify(formattedData, null, 2));
    
    console.log(`Dados processados com sucesso e salvos em ${outputPath}`);
    
    // Retornando os dados formatados para uso
    return formattedData;
    
  } catch (error) {
    console.error('Erro ao buscar dados do ClickUp:', error.message);
    if (error.response) {
      console.error('Detalhes da resposta:', error.response.data);
    }
  }
}

// Executar a função se este arquivo for chamado diretamente
if (require.main === module) {
  fetchClickUpData();
}

// Exportando a função para uso em outros arquivos
module.exports = { fetchClickUpData }; 