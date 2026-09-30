<a id="readme-top"></a>

<p align="center">
  <a href="#português">🇧🇷 Português</a>
  &nbsp;&nbsp;•&nbsp;&nbsp;
  <a href="#english">🇺🇸 English</a>
</p>

---

<a id="português"></a>

<h1 align="center">🇧🇷 Gerenciador de Usuários e Tarefas</h1>

<p align="center"><em>Documentação em Português</em></p>

API RESTful desenvolvida em **Node.js** com **TypeScript** e **Prisma ORM**, conectada a um banco de dados **PostgreSQL**.  
Permite o gerenciamento de usuários e tarefas, incluindo autenticação, criação, listagem e atualização de status.

---

## 🚀 Tecnologias

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- Supabase Auth
- Joi (validações)
- Dotenv

---

## 📦 Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/Matheuspgonsalves/tasks_manager_backend.git
   cd tasks_manager_backend
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Crie o arquivo .env**
   ```bash
   cp .env.example .env
   ```

4. **Configure a autenticação do Supabase**

   No painel do seu projeto Supabase, acesse **Settings → API** e copie a URL do projeto e a chave `anon` pública para o arquivo `.env`:

   ```env
   SUPABASE_URL="https://seu-project-ref.supabase.co"
   SUPABASE_ANON_KEY="sua-chave-anon-public-do-supabase"
   ```

   Essas variáveis são obrigatórias para que o login, o registro e a validação de usuários funcionem. Não utilize a chave `service_role` como `SUPABASE_ANON_KEY`.

---

## 💾 Banco de Dados

Este projeto utiliza **PostgreSQL** como banco de dados principal.  
Antes de rodar a aplicação, certifique-se de que o banco está **instalado e em execução** na sua máquina.

1. **Crie o banco de dados**
   - Via terminal:
     ```bash
     createdb pg-tasks-manager
     ```
     ou utilize ferramentas gráficas como **pgAdmin** ou **DBeaver**.

2. **Atualize a variável de ambiente**
   - No arquivo `.env`, configure a variável de conexão com o banco:
     ```env
     DATABASE_URL="postgresql://postgres:SENHA@localhost:5432/pg-tasks-manager?schema=public"
     ```

3. **Gere o cliente Prisma**
   ```bash
   npx prisma generate
   ```

4. **Execute as migrations existentes**
   ```bash
   npx prisma migrate deploy
   ```

5. **Verifique o banco de dados**
   ```bash
   npx prisma studio
   ```

---

## ▶️ Execute o Servidor

- **Modo desenvolvimento:**
  ```bash
  npm run dev
  ```

- **Modo produção:**
  ```bash
  npm run build
  npm start
  ```

---

## 👨‍💻 Autor
**Matheus Pereira Gonsalves**  
Desenvolvedor Backend • Node.js | TypeScript | Prisma  
[🔗 LinkedIn](https://linkedin.com/in/matheuspgonsalves) • [💻 GitHub](https://github.com/Matheuspgonsalves)

<p align="right"><a href="#readme-top">⬆ Voltar ao topo</a></p>

---

<a id="english"></a>

<h1 align="center">🇺🇸 User and Task Manager</h1>

<p align="center"><em>Documentation in English</em></p>

RESTful API developed with **Node.js**, **TypeScript**, and **Prisma ORM**, connected to a **PostgreSQL** database.  
It provides user and task management, including authentication, creation, listing, and status updates.

---

## 🚀 Technologies

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- Supabase Auth
- Joi (validation)
- Dotenv

---

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Matheuspgonsalves/tasks_manager_backend.git
   cd tasks_manager_backend
   ```

2. **Install the dependencies**
   ```bash
   npm install
   ```

3. **Create the .env file**
   ```bash
   cp .env.example .env
   ```

4. **Configure Supabase authentication**

   In your Supabase project dashboard, open **Settings → API** and copy the project URL and public `anon` key to the `.env` file:

   ```env
   SUPABASE_URL="https://your-project-ref.supabase.co"
   SUPABASE_ANON_KEY="your-public-supabase-anon-key"
   ```

   These variables are required for login, registration, and user validation to work. Do not use the `service_role` key as `SUPABASE_ANON_KEY`.

---

## 💾 Database

This project uses **PostgreSQL** as its main database.  
Before running the application, make sure the database is **installed and running** on your machine.

1. **Create the database**
   - Using the terminal:
     ```bash
     createdb pg-tasks-manager
     ```
     Alternatively, use a graphical tool such as **pgAdmin** or **DBeaver**.

2. **Update the environment variable**
   - In the `.env` file, configure the database connection variable:
     ```env
     DATABASE_URL="postgresql://postgres:PASSWORD@localhost:5432/pg-tasks-manager?schema=public"
     ```

3. **Generate the Prisma client**
   ```bash
   npx prisma generate
   ```

4. **Apply the existing migrations**
   ```bash
   npx prisma migrate deploy
   ```

5. **Inspect the database**
   ```bash
   npx prisma studio
   ```

---

## ▶️ Run the Server

- **Development mode:**
  ```bash
  npm run dev
  ```

- **Production mode:**
  ```bash
  npm run build
  npm start
  ```

---

## 👨‍💻 Author
**Matheus Pereira Gonsalves**  
Backend Developer • Node.js | TypeScript | Prisma  
[🔗 LinkedIn](https://www.linkedin.com/in/matheuspereiragonsalves/) • [💻 GitHub](https://github.com/Matheuspgonsalves)

<p align="right"><a href="#readme-top">⬆ Back to top</a></p>
