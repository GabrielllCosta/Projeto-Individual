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

### 3.1. Modelagem do banco de dados  (Semana 3)

![Banco de dados ](imagens/modelo-banco.png)

O modelo relacional abaixo representa a estrutura do banco de dados de um sistema de gerenciamento de tarefas. Ele é composto por três entidades principais: users, categories e tasks.

🔹 Tabela users
Armazena os dados dos usuários do sistema.

id: Identificador único do usuário (PK).

username: Nome de usuário (único e obrigatório).

email: Email do usuário (único e obrigatório).

password: Senha criptografada (obrigatória).

🔹 Tabela categories
Classifica as tarefas em categorias.

id: Identificador único da categoria (PK).

name: Nome da categoria (obrigatório).

description: Descrição opcional da categoria.

🔹 Tabela tasks
Armazena as tarefas atribuídas aos usuários.

id: Identificador único da tarefa (PK).

title: Título da tarefa.

description: Descrição da tarefa.

due_date: Data de vencimento.

status: Status da tarefa (por padrão, "pendente").

user_id: Chave estrangeira que referencia users.id 

category_id: Chave estrangeira que referencia categories.id 

Relações Entre Tabelas

users → tasks: Um usuário pode ter várias tarefas. 

categories → tasks: Uma categoria pode ser atribuída a várias tarefas. 

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



### 3.1.1 BD e Models (Semana 5)
*Descreva aqui os Models implementados no sistema web*

### 3.2. Arquitetura (Semana 5)

*Posicione aqui o diagrama de arquitetura da sua solução de aplicação web. Atualize sempre que necessário.*

**Instruções para criação do diagrama de arquitetura**  
- **Model**: A camada que lida com a lógica de negócios e interage com o banco de dados.
- **View**: A camada responsável pela interface de usuário.
- **Controller**: A camada que recebe as requisições, processa as ações e atualiza o modelo e a visualização.
  
*Adicione as setas e explicações sobre como os dados fluem entre o Model, Controller e View.*

### 3.3. Wireframes (Semana 03 - opcional)

*Posicione aqui as imagens do wireframe construído para sua solução e, opcionalmente, o link para acesso (mantenha o link sempre público para visualização).*

### 3.4. Guia de estilos (Semana 05 - opcional)

*Descreva aqui orientações gerais para o leitor sobre como utilizar os componentes do guia de estilos de sua solução.*


### 3.5. Protótipo de alta fidelidade (Semana 05 - opcional)

*Posicione aqui algumas imagens demonstrativas de seu protótipo de alta fidelidade e o link para acesso ao protótipo completo (mantenha o link sempre público para visualização).*

### 3.6. WebAPI e endpoints (Semana 05)

*Utilize um link para outra página de documentação contendo a descrição completa de cada endpoint. Ou descreva aqui cada endpoint criado para seu sistema.*  

### 3.7 Interface e Navegação (Semana 07)

*Descreva e ilustre aqui o desenvolvimento do frontend do sistema web, explicando brevemente o que foi entregue em termos de código e sistema. Utilize prints de tela para ilustrar.*

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
