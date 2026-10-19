require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// Importação das rotas existentes
const postRoutes = require('./routes/postRoutes');
const healthRoutes = require('./routes/healthRoutes');
const databaseRoutes = require('./routes/databaseRoutes');

// Novas rotas da Fase 4
const teacherRoutes = require('./routes/teacherRoutes');
const studentRoutes = require('./routes/studentRoutes');

const { initDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rota de Login atualizada com suporte a Role no JWT
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Login mock de Professor para testes
    if (email === 'admin@fiap.com.br' && password === '123456') {
        const user = {
            id: 1,
            name: 'Professor Admin',
            email,
            role: 'teacher' // Role exigida para permissões administrativas
        };

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'secret_key_default',
            { expiresIn: '8h' }
        );

        return res.json({ token, user });
    }

    // Login mock de Aluno para testes
    if (email === 'aluno@fiap.com.br' && password === '123456') {
        const user = {
            id: 2,
            name: 'Aluno Teste',
            email,
            role: 'student' // Role para acessos somente leitura
        };

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'secret_key_default',
            { expiresIn: '8h' }
        );

        return res.json({ token, user });
    }

    return res.status(401).json({ error: 'Credenciais inválidas' });
});

// Registro de todas as rotas da aplicação
app.use('/', postRoutes);
app.use('/', healthRoutes);
app.use('/', databaseRoutes);
app.use('/', teacherRoutes);
app.use('/', studentRoutes);

// Inicialização do Banco de Dados e Servidor Express
initDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
        });
    })
    .catch((err) => {
        console.error(' Erro ao inicializar o banco de dados:', err);
    });