
const { pool } = require('../config/database');

class PostRepository {

    // CRIAR POST
    async create({ title, content, author }) {
        const queryText = `
            INSERT INTO posts(title, content, author)
            VALUES($1, $2, $3)
            RETURNING *;
        `;

        const values = [title, content, author];
        const { rows } = await pool.query(queryText, values);

        return rows[0];
    }

    // BUSCAR POSTS COM PAGINAÇÃO
    async findAll(limit = 10, offset = 0) {
        const queryText = `
            SELECT *
            FROM posts
            ORDER BY "createdAt" DESC
            LIMIT $1 OFFSET $2;
        `;

        const { rows } = await pool.query(queryText, [limit, offset]);

        return rows;
    }

    // CONTAR TODOS OS POSTS
    async countAll() {
        const queryText = `
            SELECT COUNT(*)
            FROM posts;
        `;

        const { rows } = await pool.query(queryText);

        return parseInt(rows[0].count, 10);
    }

    // PESQUISAR POSTS COM PAGINAÇÃO
    async searchPosts(term, limit = 10, offset = 0) {
        const queryText = `
            SELECT *
            FROM posts
            WHERE title ILIKE $1 OR content ILIKE $1
            ORDER BY "createdAt" DESC
            LIMIT $2 OFFSET $3;
        `;

        const searchTerm = `%${term}%`;

        const { rows } = await pool.query(queryText, [
            searchTerm,
            limit,
            offset
        ]);

        return rows;
    }

    // CONTAR RESULTADOS DA PESQUISA
    async countSearch(term) {
        const queryText = `
            SELECT COUNT(*)
            FROM posts
            WHERE title ILIKE $1 OR content ILIKE $1;
        `;

        const searchTerm = `%${term}%`;

        const { rows } = await pool.query(queryText, [searchTerm]);

        return parseInt(rows[0].count, 10);
    }

    // BUSCAR POST POR ID
    async findById(id) {
        const queryText = `
            SELECT *
            FROM posts
            WHERE id = $1;
        `;

        const { rows } = await pool.query(queryText, [id]);

        return rows[0] || null;
    }

    // ATUALIZAR POST
    async update(id, { title, content, author }) {
        const queryText = `
            UPDATE posts
            SET
                title = $1,
                content = $2,
                author = $3,
                "updatedAt" = CURRENT_TIMESTAMP
            WHERE id = $4
            RETURNING *;
        `;

        const values = [title, content, author, id];
        const { rows } = await pool.query(queryText, values);

        return rows[0] || null;
    }

    // DELETAR POST
    async delete(id) {
        const queryText = `
            DELETE FROM posts
            WHERE id = $1
            RETURNING *;
        `;

        const { rows } = await pool.query(queryText, [id]);

        return rows.length > 0;
    }
}

module.exports = new PostRepository();
