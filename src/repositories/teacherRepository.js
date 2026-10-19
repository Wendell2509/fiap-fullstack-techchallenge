// IMPORTA CONEXAO COM O BANCO
const { pool } = require('../config/database');

class TeacherRepository {

    // METODO PARA CADASTRAR UM PROFESSOR
    async create({ name, email, department }) {
        const queryText = `
            INSERT INTO teachers(name, email, department)
            VALUES($1, $2, $3)
            RETURNING *;
        `;
        const values = [name, email, department];
        const { rows } = await pool.query(queryText, values);
        return rows[0];
    }

    // METODO PARA BUSCAR TODOS OS PROFESSORES (PAGINADO)
    async findAll(limit = 10, offset = 0) {
        const queryText = `
            SELECT * FROM teachers 
            ORDER BY "createdAt" DESC 
            LIMIT $1 OFFSET $2;
        `;
        const { rows } = await pool.query(queryText, [limit, offset]);
        return rows;
    }

    // METODO PARA CONTAR TOTAL DE PROFESSORES (PARA A PAGINACAO)
    async countAll() {
        const queryText = 'SELECT COUNT(*) FROM teachers;';
        const { rows } = await pool.query(queryText);
        return parseInt(rows[0].count, 10);
    }

    // METODO DE BUSCA POR ID
    async findById(id) {
        const queryText = 'SELECT * FROM teachers WHERE id = $1;';
        const { rows } = await pool.query(queryText, [id]);
        return rows[0] || null;
    }

    // METODO PARA ATUALIZAR PROFESSOR
    async update(id, { name, email, department }) {
        const queryText = `
            UPDATE teachers
            SET name = $1, email = $2, department = $3
            WHERE id = $4
            RETURNING *;
        `;
        const values = [name, email, department, id];
        const { rows } = await pool.query(queryText, values);
        return rows[0] || null;
    }

    // METODO PARA DELETAR POR ID
    async delete(id) {
        const queryText = 'DELETE FROM teachers WHERE id = $1 RETURNING *;';
        const { rows } = await pool.query(queryText, [id]);
        return rows.length > 0;
    }
}

// INSTANCIA UNICA CONSUMIDA NO CONTROLLER
module.exports = new TeacherRepository();