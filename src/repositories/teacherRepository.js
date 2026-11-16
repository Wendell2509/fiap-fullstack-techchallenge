
const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class TeacherRepository {

    // CADASTRAR PROFESSOR E CRIAR CONTA DE ACESSO
    async create({ name, email, department }) {
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
                'teacher'
            ]);

            const userId = userResult.rows[0].id;

            const teacherQuery = `
                INSERT INTO teachers(user_id, name, email, department)
                VALUES($1, $2, $3, $4)
                RETURNING *;
            `;

            const teacherResult = await client.query(teacherQuery, [
                userId,
                name,
                email,
                department
            ]);

            await client.query('COMMIT');

            return teacherResult.rows[0];

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    // BUSCAR TODOS OS PROFESSORES
    async findAll(limit = 10, offset = 0) {
        const queryText = `
            SELECT * FROM teachers
            ORDER BY "createdAt" DESC
            LIMIT $1 OFFSET $2;
        `;

        const { rows } = await pool.query(queryText, [limit, offset]);
        return rows;
    }

    // CONTAR PROFESSORES
    async countAll() {
        const queryText = 'SELECT COUNT(*) FROM teachers;';
        const { rows } = await pool.query(queryText);

        return parseInt(rows[0].count, 10);
    }

    // BUSCAR PROFESSOR POR ID
    async findById(id) {
        const queryText = `
            SELECT * FROM teachers
            WHERE id = $1;
        `;

        const { rows } = await pool.query(queryText, [id]);
        return rows[0] || null;
    }

    // ATUALIZAR PROFESSOR E SUA CONTA
    async update(id, { name, email, department }) {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const teacherQuery = `
                UPDATE teachers
                SET name = $1, email = $2, department = $3
                WHERE id = $4
                RETURNING *;
            `;

            const teacherResult = await client.query(teacherQuery, [
                name,
                email,
                department,
                id
            ]);

            if (teacherResult.rows.length === 0) {
                await client.query('ROLLBACK');
                return null;
            }

            const teacher = teacherResult.rows[0];

            if (teacher.user_id) {
                await client.query(
                    `UPDATE users
                     SET name = $1, email = $2
                     WHERE id = $3;`,
                    [name, email, teacher.user_id]
                );
            }

            await client.query('COMMIT');

            return teacher;

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    // EXCLUIR PROFESSOR E SUA CONTA DE ACESSO
    async delete(id) {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const result = await client.query(
                'SELECT user_id FROM teachers WHERE id = $1;',
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
                    'DELETE FROM teachers WHERE id = $1;',
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

module.exports = new TeacherRepository();
