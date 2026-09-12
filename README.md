# FIAP Pos-Tech - Fase 3 - Tech Challenge

Aplicação **Full Stack** (Blogging Educacional) desenvolvida para o Tech Challenge da Fase 3 da Pós-Tech FIAP. O projeto integra um back-end estruturado em camadas com Node.js/Express, persistência em PostgreSQL, container via Docker e um front-end em React.

## Sobre o projeto

O sistema permite que docentes realizem a autenticação na plataforma, gerenciem postagens (criação, edição, remoção e listagem) e utilizem ferramentas de busca, enquanto alunos e visitantes consultam os conteúdos publicados de forma integrada e responsiva.

## Tecnologias previstas

- **Front-end:** React, Vite, React Router DOM, Axios
- **Back-end:** Node.js, Express, Cors, Dotenv
- **Banco de Dados:** PostgreSQL
- **DevOps:** Docker & Docker Compose
- **Qualidade & Testes:** Testes automatizados e rotas de Health Check

## Instruções
1. Instalar os programas necessarios (comandos para verificar)
    * git --version
    * node -v
    * npm -v
    * docker --version
    * docker compose version

2. Clonar o repositório
    * git clone https://github.com/Wendell2509/fiap-fullstack-techchallenge-fase3
  
3.  Entrar na pasta do projeto
    * cd fiap-fullstack-techchallenge-fase3

4. Instalar dependencias
    *  npm install

5. Verificar o arquivo .env ou cria-lo
    * Dentro do projeto que possui os logins e senhas para acessar o projeto/database

6. Abrir o Docker Desktop
    * Abrir o Docker Desktop pelo menu iniciar e esperar ficar rodando
    

7. Subir os containers da API e do PostgreSQL (executar comando dentro da pasta raiz)
    * docker compose up --build
    * * é possível verificar o container executando o comando abaixo dentro da pasta raiz
      * docker ps 

8. Subir aplicação web (dentro da pasta front-end executar)
    * npm run dev

9. Acessar a aplicação web:

    *    Front-end (Aplicação Web): http://localhost:5173
    *    Status do Banco de Dados: http://localhost:3000/database/health
10. Credencias de acesso
    * professor@fiap.com
    * 123456
