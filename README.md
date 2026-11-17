# FIAP Pós-Tech – Tech Challenge – Fase 4

Aplicação full stack de blogging educacional desenvolvida como parte do Tech Challenge da Pós-Tech FIAP.

O projeto integra uma API REST desenvolvida em Node.js e Express, banco de dados PostgreSQL, aplicação web em React e aplicativo mobile em React Native.

## Sobre o projeto

A plataforma permite o gerenciamento de publicações educacionais, professores e alunos, com autenticação e controle de permissões por perfil de usuário.

Professores autenticados podem criar, visualizar, editar e excluir publicações, além de gerenciar professores e alunos. Alunos podem acessar e consultar as publicações, sem permissão para modificá-las.

A aplicação mobile consome os mesmos serviços REST disponibilizados pelo backend.

## Funcionalidades

### Publicações
- Listagem de publicações.
- Busca por publicações.
- Visualização detalhada.
- Criação, edição e exclusão de publicações por professores.
- Paginação dos resultados.

### Autenticação e autorização
- Login com e-mail e senha.
- Autenticação utilizando JWT.
- Persistência segura da sessão no aplicativo mobile.
- Controle de acesso conforme o perfil do usuário.
- Proteção das rotas que exigem autenticação.

### Admin account
- usuário admin
- login: admin@fiap.com.br
- senha: 123456
- Os demais usuários criados a partir do admin vão ter a senha padrão: fiap2026

### Professores
- Cadastro de professores.
- Listagem paginada.
- Edição e exclusão de registros.

### Alunos
- Cadastro de alunos.
- Listagem paginada.
- Edição e exclusão de registros.

## Tecnologias utilizadas

| Camada | Tecnologias |
|---|---|
| Front-end Web | React, Vite, React Router DOM, Axios |
| Aplicativo Mobile | React Native, Expo |
| Navegação Mobile | React Navigation |
| Autenticação Mobile | JWT, Expo SecureStore |
| Back-end | Node.js, Express |
| Banco de Dados | PostgreSQL |
| Infraestrutura | Docker e Docker Compose |
| Comunicação | API REST, JSON |

## Estrutura do projeto

```text
fiap-fullstack-techchallenge/
│
├── .github/
│   └── workflows/
│
├── frontend/
│   └── Aplicação web em React
│
├── mobile/
│   └── Aplicativo mobile em React Native
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── repositories/
│   ├── routes/
│   └── server.js
│
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

## Requisitos para execução

Antes de iniciar, é necessário ter instalado:

- Node.js e npm.
- Git.
- Docker Desktop.
- Docker Compose.
- Expo Go para executar o aplicativo mobile em um dispositivo físico.

## Configuração do ambiente

Clone o repositório:

```bash
git clone https://github.com/Wendell2509/fiap-fullstack-techchallenge.git
```

Entre na pasta do projeto:

```bash
cd fiap-fullstack-techchallenge
```

Crie o arquivo `.env` a partir do modelo:

```bash
cp .env.example .env
```

No Windows PowerShell, também é possível utilizar:

```powershell
Copy-Item .env.example .env
```

Configure as variáveis necessárias para a API e para o PostgreSQL:

```env
PORT=3000
DB_HOST=fiap-db
DB_PORT=5432
DB_NAME=fiap_blog
DB_USER=fiap_user
DB_PASSWORD=sua_senha

JWT_SECRET=sua_chave_secreta

POSTGRES_DB=fiap_blog
POSTGRES_USER=postgres
POSTGRES_PASSWORD=sua_senha
```

DB_USER e DB_PASSWORD são as credenciais utilizadas pelo backend para acessar o banco de dados. POSTGRES_USER e POSTGRES_PASSWORD configuram o usuário inicial do container PostgreSQL. Essas credenciais podem ser diferentes, desde que o usuário utilizado pelo backend exista no banco e tenha as permissões necessárias.

## Executando o back-end

Na pasta raiz do projeto, com o Docker Desktop aberto, execute:

```bash
docker compose --env-file .env up -d --build
```

Para verificar os containers:

```bash
docker compose ps
```

A API estará disponível em:

```text
http://localhost:3000
```

Rotas de verificação:

- API: `http://localhost:3000/health`
- Banco de dados: `http://localhost:3000/database/health`

## Executando o front-end web

Entre na pasta do front-end:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Inicie a aplicação:

```bash
npm run dev
```

A aplicação web estará disponível no endereço informado pelo Vite, normalmente:

```text
http://localhost:5173
```

## Executando o aplicativo mobile

Entre na pasta do aplicativo:

```bash
cd mobile
```

Instale as dependências:

```bash
npm install
```

Inicie o Expo:

```bash
npx expo start
```

Com o Expo iniciado, utilize o Expo Go para executar o aplicativo em um dispositivo compatível.

Para execução em dispositivo Android conectado via USB, pode ser necessário configurar o redirecionamento das portas com ADB:

```bash
adb reverse tcp:8081 tcp:8081
adb reverse tcp:3000 tcp:3000
```

Depois, inicie o Expo com:

```bash
npx expo start --localhost
```

## Autenticação e permissões

A plataforma utiliza autenticação baseada em JWT.

As permissões são divididas conforme o perfil:

**Professor**
- Criar, editar e excluir publicações.
- Consultar publicações.
- Gerenciar professores.
- Gerenciar alunos.

**Aluno**
- Consultar publicações.
- Não possui permissão para criar, editar ou excluir publicações.

As rotas protegidas validam o token de autenticação e o perfil do usuário antes de permitir operações restritas.

## Banco de dados

O projeto utiliza PostgreSQL como sistema de gerenciamento de banco de dados.

O banco é executado em um container Docker, com persistência dos dados por meio de volume.
