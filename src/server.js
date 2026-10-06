const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const postRoutes = require('./routes/postRoutes');
const healthRoutes = require('./routes/healthRoutes');
const databaseRoutes = require('./routes/databaseRoutes');
const { initDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rota de Login gerando JWT
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (email === 'admin@fiap.com.br' && password === '123456') {
        const token = jwt.sign(
            { id: 1, email },
            process.env.JWT_SECRET || 'secret_key_default',
            { expiresIn: '1h' }
        );
        return res.json({ token });
    }

    return res.status(401).json({ error: 'Credenciais inválidas' });
});

app.use('/', postRoutes);
app.use('/', healthRoutes);
app.use('/', databaseRoutes);

initDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Erro ao inicializar o banco de dados:', err);
    });