// IMPORTA CONEXAO COM O BANCO
const { pool } = require('../config/database');

class StudentRepository {

    // METODO PARA CADASTRAR UM ESTUDANTE
    async create({ name, email, registration_number }) {
        const queryText = `
            INSERT INTO students(name, email, registration_number)
            VALUES($1, $2, $3)
            RETURNING *;
        `;
        const values = [name, email, registration_number];
        const { rows } = await pool.query(queryText, values);
        return rows[0];
    }

    // METODO PARA BUSCAR TODOS OS ESTUDANTES (PAGINADO)
    async findAll(limit = 10, offset = 0) {
        const queryText = `
            SELECT * FROM students 
            ORDER BY "createdAt" DESC 
            LIMIT $1 OFFSET $2;
        `;
        const { rows } = await pool.query(queryText, [limit, offset]);
        return rows;
    }

    // METODO PARA CONTAR TOTAL DE ESTUDANTES (PARA A PAGINACAO)
    async countAll() {
        const queryText = 'SELECT COUNT(*) FROM students;';
        const { rows } = await pool.query(queryText);
        return parseInt(rows[0].count, 10);
    }

    // METODO DE BUSCA POR ID
    async findById(id) {
        const queryText = 'SELECT * FROM students WHERE id = $1;';
        const { rows } = await pool.query(queryText, [id]);
        return rows[0] || null;
    }

    // METODO PARA ATUALIZAR ESTUDANTE
    async update(id, { name, email, registration_number }) {
        const queryText = `
            UPDATE students
            SET name = $1, email = $2, registration_number = $3
            WHERE id = $4
            RETURNING *;
        `;
        const values = [name, email, registration_number, id];
        const { rows } = await pool.query(queryText, values);
        return rows[0] || null;
    }

    // METODO PARA DELETAR POR ID
    async delete(id) {
        const queryText = 'DELETE FROM students WHERE id = $1 RETURNING *;';
        const { rows } = await pool.query(queryText, [id]);
        return rows.length > 0;
    }
}

// INSTANCIA UNICA CONSUMIDA NO CONTROLLER
module.exports = new StudentRepository();