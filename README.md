# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/4ef49493-d504-4a70-b491-c2be3f437e3d

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/4ef49493-d504-4a70-b491-c2be3f437e3d) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/4ef49493-d504-4a70-b491-c2be3f437e3d) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

# Integração com ClickUp

Este projeto agora inclui uma integração com o ClickUp que permite sincronizar as etapas do projeto diretamente do seu quadro Kanban.

## Configuração

1. Crie uma chave de API no ClickUp:
   - Acesse suas configurações de perfil no ClickUp
   - Vá para "Apps" e crie uma chave de API

2. Configure as variáveis de ambiente:
   - Copie o arquivo `.env.example` para `.env.local`
   - Preencha os valores necessários:
     - `VITE_CLICKUP_API_KEY`: Sua chave de API do ClickUp
     - `VITE_CLICKUP_TEAM_ID`: O ID do seu time (encontrado na URL)
     - `VITE_CLICKUP_SPACE_ID`: O ID do espaço de trabalho
     - `VITE_CLICKUP_LIST_ID`: O ID da lista ou quadro Kanban

3. Ou configure diretamente na interface:
   - Use o botão de configurações no painel para inserir os IDs necessários

## Como a integração funciona

1. O sistema busca as tarefas do ClickUp em intervalos regulares
2. Uma IA interpreta os dados para criar:
   - Checkpoints do projeto com status e progresso
   - Subtarefas baseadas nos checklists do ClickUp
   - Comentários associados a cada tarefa

3. As informações são exibidas no painel do cliente de forma organizada e visual

## Estrutura do quadro Kanban no ClickUp

Para obter os melhores resultados, estruture seu quadro Kanban no ClickUp com:

- Uma lista para cada fase principal do projeto
- Checklists dentro de cada tarefa para subtarefas
- Campos personalizados para datas de início e término
- Status claros que indiquem o progresso (Concluído, Em Andamento, Pendente)
