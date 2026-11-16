# Front-end Web - Tech Challenge (FIAP)

Interface Web desenvolvida em React com Vite para a plataforma educacional do Tech Challenge FIAP. A aplicação permite consultar publicações, visualizar conteúdos e realizar operações administrativas de acordo com o nível de acesso do usuário.

O frontend consome a API REST desenvolvida em Node.js e utiliza autenticação por token JWT.

## 🚀 Tecnologias Utilizadas

- **React 19:** biblioteca para construção da interface.
- **Vite:** ferramenta de desenvolvimento e build.
- **React Router DOM:** gerenciamento de rotas e navegação.
- **Axios:** comunicação HTTP com a API REST.
- **Context API:** gerenciamento global do estado de autenticação.
- **Styled Components:** estilização de componentes.
- **CSS:** estilos globais e específicos da aplicação.

## 📁 Estrutura do Projeto

```text
frontend/
├── src/
│   ├── assets/             # Recursos visuais
│   ├── components/         # Componentes reutilizáveis
│   │   ├── Header.jsx
│   │   └── PrivateRoute.jsx
│   ├── context/
│   │   └── AuthContext.jsx # Contexto de autenticação
│   ├── pages/              # Páginas da aplicação
│   │   ├── Admin.jsx
│   │   ├── CreatePost.jsx
│   │   ├── EditPost.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   └── PostDetail.jsx
│   ├── services/
│   │   └── api.js          # Configuração do Axios
│   ├── styles/
│   │   └── GlobalStyles.js
│   ├── App.jsx             # Configuração das rotas
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── package.json
└── README.md
```

## 🧭 Navegação e Funcionalidades

A navegação é gerenciada pelo React Router DOM.

| Rota | Página | Acesso |
|---|---|---|
| `/` | Home | Público |
| `/post/:id` | Detalhes da publicação | Público |
| `/login` | Login | Público |
| `/admin` | Administração | Autenticado |
| `/posts/new` | Criar publicação | Autenticado |
| `/posts/edit/:id` | Editar publicação | Autenticado |

As rotas administrativas utilizam o componente `PrivateRoute`, responsável por verificar a autenticação do usuário e redirecionar usuários não autenticados para a página de login.

## 🔐 Autenticação

O gerenciamento da autenticação é realizado pelo `AuthContext`, utilizando a Context API do React.

O fluxo de autenticação funciona da seguinte maneira:

1. O usuário informa e-mail e senha na tela de login.
2. O frontend envia as credenciais para o endpoint `POST /login`.
3. A API retorna um token JWT e os dados do usuário.
4. O token e os dados da sessão são armazenados no `localStorage`.
5. O token é enviado nas requisições seguintes pelo cabeçalho `Authorization: Bearer`.
6. Ao realizar logout, os dados da sessão são removidos.

O componente `PrivateRoute` utiliza o estado de autenticação para controlar o acesso às páginas protegidas.

## 🔌 Comunicação com a API

A comunicação com o backend é centralizada no arquivo `src/services/api.js`, utilizando Axios.

Configuração atual da API:

```javascript
baseURL: 'http://localhost:3000'
```

Um interceptor de requisições verifica a existência do token JWT no `localStorage` e adiciona automaticamente o cabeçalho de autorização.

A API backend deve estar em execução para que as funcionalidades que dependem de dados do servidor funcionem corretamente.

## 📦 Como Executar o Front-end Localmente

### Pré-requisitos

- Node.js instalado.
- npm instalado.
- Backend e banco de dados configurados e em execução.

### Instalação

Acesse a pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

### Executar em desenvolvimento

```bash
npm run dev
```

Por padrão, o Vite disponibiliza a aplicação em:

```text
http://localhost:5173
```

### Gerar build de produção

```bash
npm run build
```

Os arquivos de produção serão gerados na pasta `dist/`.

### Visualizar build de produção

```bash
npm run preview
```

### Verificar qualidade do código

```bash
npm run lint
```

## 🐳 Docker

O frontend Web é executado separadamente em ambiente de desenvolvimento por meio do Vite.

O Docker Compose da aplicação é utilizado para inicializar os serviços do backend e do banco de dados PostgreSQL.

Para executar o frontend, utilize os comandos descritos nesta documentação.

---
