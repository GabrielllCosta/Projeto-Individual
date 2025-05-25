Organizador de Tarefas para Estudantes de Inglês

Este projeto é uma aplicação web desenvolvida em Node.js com PostgreSQL, seguindo o padrão arquitetural MVC (Model-View-Controller). Seu foco é auxiliar estudantes de inglês na organização de tarefas e progresso acadêmico.

 Descrição do Sistema

A aplicação é um organizador de tarefas voltado para estudantes de inglês. Os usuários podem:

Criar tarefas com título, descrição e data de entrega

Categorizar atividades (ex: estudo, lazer, revisão)

Acompanhar o status de cada tarefa

Visualizar o progresso geral

A interface intuitiva incentiva o aprendizado com recompensas e gamificação.
```
📁 Estrutura de Pastas e Arquivos

PROJETO-INDIVIDUAL/
│
├── config/                # Configurações do banco de dados e do projeto
│   └── db.js
│
├── controllers/           # Controladores responsáveis pela lógica de negócio
│   └── userController.js
│
├── database/              # Scripts e modelos do banco de dados
│   └── modelo-banco.sql
│
├── documentos/            # Documentação do projeto
│   └── WAD.md
│
├── imagens/               # Imagens utilizadas no projeto (ex: modelos, personas)
│   ├── modelo-banco.png
│   └── persona.png
│
├── models/                # Modelos da aplicação (interações com o banco)
│   └── userModel.js
│
├── node_modules/          # Dependências instaladas (gerado automaticamente)
│
├── routes/                # Rotas da aplicação
│   ├── frontRoutes.js
│   ├── index.js
│   └── userRoutes.js
│
├── scripts/               # Scripts auxiliares de inicialização do banco
│   ├── init.sql
│   └── runSQLScript.js
│
├── services/              # Lógica de serviço (regras de negócio)
│   └── userService.js
│
├── tests/                 # Testes automatizados por camada
│   ├── userController.test.js
│   ├── userModel.test.js
│   ├── userRoutes.test.js
│   └── userService.test.js
│
├── views/                 # Views (interface com o usuário)
│   ├── components/
│   ├── css/
│   ├── layout/
│   ├── pages/
│   └── partials/
│
├── .env                   # Arquivo de variáveis de ambiente
├── .gitignore             # Arquivos e pastas ignorados pelo Git
├── app.js                 # Arquivo principal da aplicação
├── jest.config.js         # Configuração do Jest para testes
├── package.json           # Dependências e scripts do projeto
├── package-lock.json      # Controle de versões das dependências
├── readme.md              # Documentação principal do projeto
├── rest.http              # Requisições HTTP para teste da API
└── server.js              # Inicialização do servidor

``` 
Como Executar o Projeto Localmente

Requisitos:

Node.js (versão X.X.X)

PostgreSQL (versão X.X.X)

Passo a passo:

# Clone o repositório
$ git clone https://github.com/seu-usuario/seu-projeto.git
$ cd seu-projeto

# Instale as dependências
$ npm install

# Configure o ambiente
$ cp .env.example .env
# Edite o .env com as configurações do seu banco PostgreSQL

# Inicialize o banco de dados
$ npm run init-db

# Inicie o servidor
$ npm run dev

 Modelo Físico do Banco de Dados (schema.sql)
```sql
-- Tabela de usuários
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

-- Tabela de categorias
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT
);

-- Tabela de tarefas
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title VARCHAR(255),
  description TEXT,
  due_date DATE,
  status VARCHAR(50) DEFAULT 'pendente',
  user_id INTEGER NOT NULL,
  category_id INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

🛠 Funcionalidades

Organização de tarefas por categoria

Status de tarefas (pendente, concluída, etc.)

Interface voltada para estudantes

Visualização de progresso

Possibilidade de gamificação com recompensas

 Configuração do Banco de Dados e Testes de API
1. Configurar o Banco de Dados
Certifique-se de que o PostgreSQL está instalado e rodando na sua máquina. Em seguida:

Crie um banco de dados chamado organizador_tarefas (ou outro nome desejado).

Atualize o arquivo .env com as credenciais corretas:

env
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=organizador_tarefas
````
2. Rodar as Migrações
As tabelas são criadas com os comandos SQL disponíveis em scripts/init.sql.

Execute o script automaticamente com:

bash
````
npm run init-db
````
Ou manualmente via cliente PostgreSQL:

bash
````
psql -U seu_usuario -d organizador_tarefas -f scripts/init.sql
````
Certifique-se de que o usuário PostgreSQL tenha permissão de criação de tabelas.

3. Testar a API
Você pode testar os endpoints da aplicação com o arquivo rest.http, utilizando a extensão REST Client do VS Code, ou via Postman.

Exemplos de rotas disponíveis:

GET /users – Lista todos os usuários

POST /users – Cria um novo usuário

PUT /users/:id – Atualiza um usuário

DELETE /users/:id – Remove um usuário

Todas as rotas estão disponíveis nos arquivos da pasta /routes.

4. Rodar os Testes Automatizados
Para garantir que a lógica da aplicação esteja funcionando corretamente, execute:

bash
````

npm test
````
Os testes estão organizados por camada na pasta tests/:

userModel.test.js

userController.test.js

userRoutes.test.js

userService.test.js

