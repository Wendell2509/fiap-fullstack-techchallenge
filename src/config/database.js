const path = require('path');
// Carrega explicitamente o arquivo .env da raiz do projeto
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'admin_fiap',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'fiap_blog',
    password: String(process.env.DB_PASSWORD || 'senha_fiap_2026'),
    port: Number(process.env.DB_PORT) || 5432,
});

// CRIA AS TABELAS SE ELAS NÃO EXISTIREM
async function initDatabase(retries = 5, delay = 2000) {
    const queryText = `
    -- 1. Tabela de Usuários com a Role (teacher ou student)
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL CHECK (role IN ('teacher', 'student')),
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 2. Tabela de Professores
    CREATE TABLE IF NOT EXISTS teachers (
      id SERIAL PRIMARY KEY,
      user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      department VARCHAR(100),
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 3. Tabela de Estudantes
    CREATE TABLE IF NOT EXISTS students (
      id SERIAL PRIMARY KEY,
      user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      registration_number VARCHAR(50) UNIQUE NOT NULL,
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 4. Tabela de Posts
    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      author VARCHAR(255),
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

    for (let i = 1; i <= retries; i++) {
        try {
            await pool.query(queryText);
            console.log('Tabelas verificadas/criadas com sucesso!');
            return;
        } catch (error) {
            if (error.code === 'ECONNREFUSED' && i < retries) {
                console.log(`Banco de dados inicializando. Tentativa ${i}/${retries} falhou. Aguardando ${delay / 1000}s...`);
                await new Promise(res => setTimeout(res, delay));
            } else {
                console.error('Erro fatal ao criar as tabelas no banco:');
                throw error;
            }
        }
    }
}

// MÉTODO PARA BUSCAR
async function searchPosts(term) {
    const query = `
        SELECT * FROM posts 
        WHERE title ILIKE $1 OR content ILIKE $1
        ORDER BY "createdAt" DESC;
      `;
    const searchTerm = `%${term}%`;
    const result = await pool.query(query, [searchTerm]);
    return result.rows;
}

module.exports = {
    pool,
    initDatabase,
    searchPosts
};