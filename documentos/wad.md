# Web Application Document - Projeto Individual - Módulo 2 - Inteli

**_Os trechos em itálico servem apenas como guia para o preenchimento da seção. Por esse motivo, não devem fazer parte da documentação final._**

## Organization

#### Gabriel Leon Lima Costa

## Sumário

1. [Introdução](#c1)  
2. [Visão Geral da Aplicação Web](#c2)  
3. [Projeto Técnico da Aplicação Web](#c3)  
4. [Desenvolvimento da Aplicação Web](#c4)  
5. [Referências](#c5)  

<br>

## <a name="c1"></a>1. Introdução 


A aplicação WEB se trata de um organizador de tarefas focado a estudantes de inglês.A plataforma oferecerá funcionalidades como criação de tarefas, definição de prazos, categorização de atividades por tipo (estudo, lazer, revisão) e visualização de progresso. A aplicação terá uma boa interface para ajudar o estudante na sua caminhada de aprendizado e organização. Recompensas podem ser adicionadas para engajar os usuários a continuarem o seu progresso.

---

## <a name="c2"></a>2. Visão Geral da Aplicação Web

### 2.1. Personas 

![Persona ](imagens/persona.png)

### 2.2. User Stories 


US01:	Como estudante de inglês, eu quero criar tarefas de estudo para organizar o que preciso fazer.

US02:	Como estudante de inglês, eu quero categorizar minhas tarefas (estudo, lazer, revisão) para visualizar melhor minhas prioridades.

US03:	Como estudante de inglês, eu quero ganhar recompensas virtuais conforme concluo tarefas para me manter motivado.

Explicação do INVEST para User Story (US01)

I (Independente): A criação de tarefas não depende de outras funcionalidades.

N (Negociável): Pode ser ajustado conforme prioridades.

V (Valiosa): Ajuda muito a organizar o estudo do usuário, entregando valor imediato.

E (Estimável): Pode ser estimado com clareza para desenvolvimento em uma sprint.

S (Small - Pequena): A funcionalidade é pequena o suficiente para ser concluída rapidamente.

T (Testável): Pode ser testada criando e verificando tarefas dentro do sistema.



---

## <a name="c3"></a>3. Projeto da Aplicação Web

### 3.1. Modelagem do banco de dados

![Modelo do Banco de Dados](../imagens/modelo-banco-novo.png)

O modelo relacional representa a estrutura do banco de dados do sistema de gerenciamento de tarefas para estudantes de inglês. Ele é composto por três entidades principais com campos expandidos para melhor funcionalidade:

🔹 **Tabela users**
Armazena os dados dos usuários do sistema com rastreamento de atividade.

- id: Identificador único do usuário (PK)
- username: Nome de usuário (único e obrigatório)
- email: Email do usuário (único e obrigatório)
- password: Senha criptografada (obrigatória)
- created_at: Data de criação da conta
- last_login: Último acesso do usuário

🔹 **Tabela categories**
Classifica as tarefas em categorias, com suporte a categorias personalizadas.

- id: Identificador único da categoria (PK)
- name: Nome da categoria (obrigatório)
- description: Descrição da categoria
- user_id: Referência ao usuário criador (FK, opcional)
- created_at: Data de criação da categoria
- updated_at: Data da última atualização

🔹 **Tabela tasks**
Armazena as tarefas com sistema de priorização e rastreamento temporal.

- id: Identificador único da tarefa (PK)
- title: Título da tarefa
- description: Descrição detalhada
- due_date: Data de vencimento
- status: Status da tarefa (pendente, concluída, etc.)
- priority: Prioridade da tarefa (baixa, média, alta)
- user_id: Referência ao usuário (FK)
- category_id: Referência à categoria (FK)
- created_at: Data de criação da tarefa
- updated_at: Data da última atualização

**Relações Entre Tabelas:**

1. users → tasks: Um usuário pode ter várias tarefas (1:N)
2. users → categories: Um usuário pode criar várias categorias personalizadas (1:N)
3. categories → tasks: Uma categoria pode ser atribuída a várias tarefas (1:N)

**Schema SQL Atualizado:**

```sql
-- Tabela de usuários
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Tabela de categorias
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    user_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabela de tarefas
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'pendente',
    priority VARCHAR(20) DEFAULT 'média',
    user_id INTEGER NOT NULL,
    category_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

### 3.1.1 Models

O sistema utiliza três modelos principais com funcionalidades avançadas:

1. **UserModel**:
   - Gerenciamento completo de usuários
   - Sistema de autenticação com hash de senha
   - Rastreamento de atividades
   - Estatísticas de produtividade
   - Ranking de usuários
   - Proteção de dados sensíveis

Exemplo de funcionalidades:
```javascript
// Buscar progresso do usuário
static async getUserProgress(userId) {
    // Retorna estatísticas completas do usuário
    // - Total de tarefas
    // - Tarefas concluídas
    // - Taxa de conclusão
    // - Estatísticas por categoria
}

// Buscar ranking de produtividade
static async getProductivityRanking(limit = 5) {
    // Retorna ranking dos usuários mais produtivos
    // baseado em taxa de conclusão de tarefas
}
```

2. **TaskModel**:
   - CRUD completo de tarefas
   - Sistema de prioridades
   - Filtros avançados
   - Paginação e ordenação
   - Sugestões de priorização
   - Resumo diário
   - Estatísticas temporais

Exemplo de funcionalidades:
```javascript
// Buscar tarefas com filtros avançados
static async getUserTasks(userId, filters = {}) {
    // Suporta filtros por:
    // - Status
    // - Categoria
    // - Prioridade
    // - Data
    // - Texto
    // Com ordenação e paginação
}

// Buscar sugestões de priorização
static async getTaskPrioritySuggestions(userId) {
    // Retorna sugestões baseadas em:
    // - Proximidade do prazo
    // - Prioridade
    // - Status atual
}
```

3. **CategoryModel**:
   - CRUD completo de categorias
   - Suporte a categorias globais e personalizadas
   - Estatísticas detalhadas
   - Tendências temporais
   - Sugestões inteligentes
   - Proteção contra deleção acidental

Exemplo de funcionalidades:
```javascript
// Buscar tendências de categoria
static async getCategoryTrends(userId, days = 30) {
    // Retorna análise temporal de:
    // - Tarefas criadas
    // - Tarefas concluídas
    // - Média diária
    // - Evolução no período
}

// Sugerir categorias para tarefa
static async getCategorySuggestions(taskTitle) {
    // Sugere categorias baseado em:
    // - Análise do título
    // - Padrões de uso
    // - Histórico do usuário
}
```

Cada modelo implementa:
- Tratamento robusto de erros
- Validações de dados
- Proteção contra SQL injection
- Logging de operações
- Métricas de uso

### 3.2. Arquitetura (Semana 5)

![Arquitetura ](imagens/arquitetura_MVC.png)

O usuário interage com a View (interface no navegador).

A View envia requisições para os Controllers, que processam essas requisições.

Os Controllers acessam os Models, que realizam as operações no banco de dados.

Os Models se comunicam diretamente com as tabelas no banco.

Após o processamento, os dados fluem de volta do banco → model → controller → view.

### 3.3. Wireframes 

![Banco de dados ](imagens/wireframe.png)

### 3.4. Guia de estilos (Semana 05 - opcional)

*Descreva aqui orientações gerais para o leitor sobre como utilizar os componentes do guia de estilos de sua solução.*


### 3.5. Protótipo de alta fidelidade (Semana 05 - opcional)

*Posicione aqui algumas imagens demonstrativas de seu protótipo de alta fidelidade e o link para acesso ao protótipo completo (mantenha o link sempre público para visualização).*

### 3.6. WebAPI e endpoints (Semana 05)

*Utilize um link para outra página de documentação contendo a descrição completa de cada endpoint. Ou descreva aqui cada endpoint criado para seu sistema.*  

### 3.7 Interface e Navegação

A interface do sistema foi desenvolvida utilizando EJS como template engine, Bootstrap 5 para o framework CSS base e CSS customizado para estilização específica. A navegação é intuitiva e responsiva, adaptando-se a diferentes tamanhos de tela.

#### Principais Componentes da Interface:

1. **Barra de Navegação**
   - Logo do sistema
   - Menu de navegação com links para as principais funcionalidades
   - Design responsivo com menu hamburguer em telas menores

2. **Lista de Tarefas**
   - Cards para cada tarefa com informações relevantes
   - Badges coloridos para indicar categorias
   - Botões de ação (concluir, editar, excluir)
   - Animações suaves nos cards
   - Layout em grid responsivo

3. **Formulário de Tarefas**
   - Campos validados para título, descrição, categoria e data
   - Seleção de categoria via dropdown
   - Botões de ação com feedback visual
   - Layout centralizado e organizado

4. **Página de Erro**
   - Design amigável para mensagens de erro
   - Botão de retorno para a página principal
   - Mensagens claras e objetivas

#### Tecnologias Utilizadas no Frontend:

- **EJS**: Template engine para geração dinâmica de HTML
- **Bootstrap 5**: Framework CSS para layout responsivo
- **CSS Customizado**: Estilização específica e animações
- **Fetch API**: Comunicação assíncrona com o backend
- **JavaScript**: Interatividade e manipulação do DOM

#### Funcionalidades Implementadas:

1. **Gerenciamento de Tarefas**
   - Criação de novas tarefas
   - Edição de tarefas existentes
   - Exclusão de tarefas
   - Marcação de tarefas como concluídas

2. **Categorização**
   - Visualização por categorias
   - Cores distintas para cada categoria
   - Filtro de tarefas por categoria

3. **Feedback Visual**
   - Animações suaves nas interações
   - Mensagens de sucesso/erro
   - Loading states durante operações assíncronas

#### Screenshots da Interface:

![Lista de Tarefas](imagens/interface-lista.png)
*Tela principal com lista de tarefas*

![Formulário de Tarefa](imagens/form.png)
*Formulário de criação/edição de tarefa*

### 3.7.1 Visualização e Criação de Tarefas

A interface de tarefas foi projetada para oferecer uma experiência intuitiva e eficiente aos estudantes de inglês.

#### Visualização de Tarefas

![Lista de Tarefas](imagens/interface-lista.png)
*Tela principal com lista de tarefas*

A tela de visualização de tarefas inclui:

1. **Filtros Avançados**
   - Filtro por status (pendente, concluída, atrasada)
   - Filtro por categoria
   - Filtro por prioridade
   - Busca por texto em título/descrição
   - Ordenação customizável (data, prioridade, status)

2. **Cards de Tarefa**
   - Título e descrição da tarefa
   - Badge de categoria com código de cores
   - Indicador de prioridade (baixa, média, alta)
   - Status visual (ícone e cor)
   - Data de vencimento formatada (hoje, amanhã, atrasada)
   - Botões de ação rápida

3. **Resumo e Estatísticas**
   - Total de tarefas por status
   - Progresso geral (barra de progresso)
   - Tarefas próximas do prazo
   - Sugestões de priorização

#### Criação/Edição de Tarefas

![Formulário de Tarefa](imagens/form.png)
*Formulário de criação/edição de tarefa*

O formulário de tarefas oferece:

1. **Campos Principais**
   - Título da tarefa (obrigatório)
   - Descrição detalhada (suporte a formatação)
   - Data de vencimento com calendário
   - Seleção de categoria (com sugestões inteligentes)
   - Nível de prioridade

2. **Recursos Avançados**
   - Sugestão automática de categorias baseada no título
   - Validação em tempo real dos campos
   - Preview da formatação da descrição
   - Atalhos de teclado para salvar/cancelar

3. **Feedback Visual**
   - Indicadores de campo obrigatório
   - Mensagens de erro contextuais
   - Animações de transição
   - Loading states durante o salvamento

4. **Funcionalidades Extras**
   - Botão de salvamento rápido
   - Opção de criar categoria durante o cadastro
   - Template de tarefas frequentes
   - Histórico de alterações

### 3.8 Integração Frontend-Backend

A comunicação entre o frontend e backend é realizada através da Fetch API, proporcionando uma experiência fluida e assíncrona.

#### Endpoints e Integrações

1. **Gestão de Tarefas**
```javascript
// Buscar todas as tarefas do usuário
async function fetchTasks() {
    try {
        const response = await fetch('/api/tasks', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const tasks = await response.json();
        updateTaskList(tasks);
    } catch (error) {
        showErrorNotification('Erro ao carregar tarefas');
    }
}

// Criar nova tarefa
async function createTask(taskData) {
    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });
        const newTask = await response.json();
        addTaskToList(newTask);
        showSuccessNotification('Tarefa criada com sucesso');
    } catch (error) {
        showErrorNotification('Erro ao criar tarefa');
    }
}

// Atualizar status da tarefa
async function updateTaskStatus(taskId, status) {
    try {
        const response = await fetch(`/api/tasks/${taskId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });
        const updatedTask = await response.json();
        updateTaskInList(updatedTask);
    } catch (error) {
        showErrorNotification('Erro ao atualizar status');
    }
}
```

2. **Gestão de Categorias**
```javascript
// Buscar categorias com estatísticas
async function fetchCategories() {
    try {
        const response = await fetch('/api/categories/stats', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const categories = await response.json();
        updateCategoryFilters(categories);
        updateCategoryStats(categories);
    } catch (error) {
        showErrorNotification('Erro ao carregar categorias');
    }
}

// Criar nova categoria
async function createCategory(categoryData) {
    try {
        const response = await fetch('/api/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(categoryData)
        });
        const newCategory = await response.json();
        addCategoryToList(newCategory);
        showSuccessNotification('Categoria criada com sucesso');
    } catch (error) {
        showErrorNotification('Erro ao criar categoria');
    }
}
```

3. **Análise e Estatísticas**
```javascript
// Buscar estatísticas do usuário
async function fetchUserStats() {
    try {
        const response = await fetch('/api/users/stats', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const stats = await response.json();
        updateDashboard(stats);
    } catch (error) {
        showErrorNotification('Erro ao carregar estatísticas');
    }
}

// Buscar tendências de conclusão
async function fetchCompletionTrends(period = '30days') {
    try {
        const response = await fetch(`/api/tasks/trends?period=${period}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const trends = await response.json();
        updateTrendsChart(trends);
    } catch (error) {
        showErrorNotification('Erro ao carregar tendências');
    }
}
```

#### Tratamento de Erros e Loading States

```javascript
// Gerenciamento de estados de loading
function setLoading(elementId, isLoading) {
    const element = document.getElementById(elementId);
    if (isLoading) {
        element.classList.add('loading');
        element.disabled = true;
    } else {
        element.classList.remove('loading');
        element.disabled = false;
    }
}

// Sistema de notificações
function showNotification(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Tratamento global de erros
async function handleApiRequest(request) {
    try {
        const response = await request();
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        showNotification(error.message, 'error');
        throw error;
    }
}
```

#### Exemplos de Uso na Interface

1. **Lista de Tarefas**
```javascript
// Carregamento inicial da página
document.addEventListener('DOMContentLoaded', async () => {
    setLoading('taskList', true);
    try {
        await Promise.all([
            fetchTasks(),
            fetchCategories(),
            fetchUserStats()
        ]);
    } catch (error) {
        console.error('Error loading initial data:', error);
    } finally {
        setLoading('taskList', false);
    }
});

// Atualização em tempo real
taskForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    setLoading('submitButton', true);
    
    const formData = new FormData(taskForm);
    const taskData = Object.fromEntries(formData.entries());
    
    try {
        await createTask(taskData);
        taskForm.reset();
        showNotification('Tarefa criada com sucesso');
    } catch (error) {
        showNotification('Erro ao criar tarefa', 'error');
    } finally {
        setLoading('submitButton', false);
    }
});
```

2. **Filtros e Busca**
```javascript
// Implementação de filtros dinâmicos
searchInput.addEventListener('input', debounce(async (e) => {
    const searchTerm = e.target.value;
    setLoading('taskList', true);
    
    try {
        const response = await fetch(`/api/tasks/search?q=${searchTerm}`);
        const tasks = await response.json();
        updateTaskList(tasks);
    } catch (error) {
        showNotification('Erro na busca', 'error');
    } finally {
        setLoading('taskList', false);
    }
}, 300));

// Filtro por categoria
categorySelect.addEventListener('change', async (e) => {
    const categoryId = e.target.value;
    setLoading('taskList', true);
    
    try {
        const response = await fetch(`/api/tasks?category=${categoryId}`);
        const tasks = await response.json();
        updateTaskList(tasks);
    } catch (error) {
        showNotification('Erro ao filtrar por categoria', 'error');
    } finally {
        setLoading('taskList', false);
    }
});
```

Esta integração proporciona:
- Comunicação assíncrona eficiente
- Tratamento robusto de erros
- Feedback visual para o usuário
- Estados de carregamento
- Atualizações em tempo real
- Cache de dados quando apropriado
- Validação de dados no cliente

---

## <a name="c4"></a>4. Desenvolvimento da Aplicação Web (Semana 8)

### 4.1 Demonstração do Sistema Web (Semana 8)

*VIDEO: Insira o link do vídeo demonstrativo nesta seção*
*Descreva e ilustre aqui o desenvolvimento do sistema web completo, explicando brevemente o que foi entregue em termos de código e sistema. Utilize prints de tela para ilustrar.*

### 4.2 Conclusões e Trabalhos Futuros (Semana 8)

*Indique pontos fortes e pontos a melhorar de maneira geral.*
*Relacione também quaisquer outras ideias que você tenha para melhorias futuras.*



## <a name="c5"></a>5. Referências

_Incluir as principais referências de seu projeto, para que o leitor possa consultar caso ele se interessar em aprofundar._<br>

---
---
