
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Importação das rotas existentes
const postRoutes = require('./routes/postRoutes');
const healthRoutes = require('./routes/healthRoutes');
const databaseRoutes = require('./routes/databaseRoutes');

// Rotas da Fase 4
const teacherRoutes = require('./routes/teacherRoutes');
const studentRoutes = require('./routes/studentRoutes');

const { pool, initDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// LOGIN COM AUTENTICAÇÃO NO BANCO DE DADOS
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: 'E-mail e senha são obrigatórios.'
            });
        }

        // Busca o usuário pelo e-mail
        const query = `
            SELECT id, name, email, password, role
            FROM users
            WHERE LOWER(email) = LOWER($1);
        `;

        const result = await pool.query(query, [email.trim()]);

        if (result.rows.length === 0) {
            return res.status(401).json({
                error: 'Credenciais inválidas.'
            });
        }

        const userDatabase = result.rows[0];

        // Valida a senha utilizando bcrypt
        const passwordValid = await bcrypt.compare(
            password,
            userDatabase.password
        );

        if (!passwordValid) {
            return res.status(401).json({
                error: 'Credenciais inválidas.'
            });
        }

        // Dados públicos do usuário
        const user = {
            id: userDatabase.id,
            name: userDatabase.name,
            email: userDatabase.email,
            role: userDatabase.role
        };

        // Gera o token JWT
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET || 'secret_key_default',
            {
                expiresIn: '8h'
            }
        );

        return res.json({
            token,
            user
        });

    } catch (error) {
        console.error('Erro ao realizar login:', error);

        return res.status(500).json({
            error: 'Erro interno ao realizar login.'
        });
    }
});

// Registro das rotas da aplicação
app.use('/', postRoutes);
app.use('/', healthRoutes);
app.use('/', databaseRoutes);
app.use('/', teacherRoutes);
app.use('/', studentRoutes);

// Inicialização do banco e servidor
initDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Erro ao inicializar o banco de dados:', err);
    });
