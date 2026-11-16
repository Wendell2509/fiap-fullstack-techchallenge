
const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class StudentRepository {

    // CADASTRAR ALUNO E CRIAR CONTA DE ACESSO
    async create({ name, email, registration_number }) {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const passwordHash = await bcrypt.hash('fiap2026', 10);

            const userQuery = `
                INSERT INTO users(name, email, password, role)
                VALUES($1, $2, $3, $4)
                RETURNING id;
            `;

            const userResult = await client.query(userQuery, [
                name,
                email,
                passwordHash,
                'student'
            ]);

            const userId = userResult.rows[0].id;

            const studentQuery = `
                INSERT INTO students(user_id, name, email, registration_number)
                VALUES($1, $2, $3, $4)
                RETURNING *;
            `;

            const studentResult = await client.query(studentQuery, [
                userId,
                name,
                email,
                registration_number
            ]);

            await client.query('COMMIT');

            return studentResult.rows[0];

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    // BUSCAR TODOS OS ALUNOS
    async findAll(limit = 10, offset = 0) {
        const queryText = `
            SELECT * FROM students
            ORDER BY "createdAt" DESC
            LIMIT $1 OFFSET $2;
        `;

        const { rows } = await pool.query(queryText, [limit, offset]);
        return rows;
    }

    // CONTAR ALUNOS
    async countAll() {
        const queryText = 'SELECT COUNT(*) FROM students;';
        const { rows } = await pool.query(queryText);

        return parseInt(rows[0].count, 10);
    }

    // BUSCAR ALUNO POR ID
    async findById(id) {
        const queryText = `
            SELECT * FROM students
            WHERE id = $1;
        `;

        const { rows } = await pool.query(queryText, [id]);
        return rows[0] || null;
    }

    // ATUALIZAR ALUNO E SUA CONTA
    async update(id, { name, email, registration_number }) {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const studentQuery = `
                UPDATE students
                SET name = $1, email = $2, registration_number = $3
                WHERE id = $4
                RETURNING *;
            `;

            const studentResult = await client.query(studentQuery, [
                name,
                email,
                registration_number,
                id
            ]);

            if (studentResult.rows.length === 0) {
                await client.query('ROLLBACK');
                return null;
            }

            const student = studentResult.rows[0];

            if (student.user_id) {
                await client.query(
                    `UPDATE users
                     SET name = $1, email = $2
                     WHERE id = $3;`,
                    [name, email, student.user_id]
                );
            }

            await client.query('COMMIT');

            return student;

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    // EXCLUIR ALUNO E SUA CONTA DE ACESSO
    async delete(id) {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const result = await client.query(
                'SELECT user_id FROM students WHERE id = $1;',
                [id]
            );

            if (result.rows.length === 0) {
                await client.query('ROLLBACK');
                return false;
            }

            const userId = result.rows[0].user_id;

            if (userId) {
                await client.query(
                    'DELETE FROM users WHERE id = $1;',
                    [userId]
                );
            } else {
                await client.query(
                    'DELETE FROM students WHERE id = $1;',
                    [id]
                );
            }

            await client.query('COMMIT');

            return true;

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}

module.exports = new StudentRepository();
