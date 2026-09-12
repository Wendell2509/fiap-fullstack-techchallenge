require('dotenv').config();
const express = require('express');
const cors = require('cors');
const healthRoutes = require('./routes/healthRoutes');
const databaseRoutes = require('./routes/databaseRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'API do Tech Challenge - Blogging Educacional',
    });
});

app.use(healthRoutes);
app.use(databaseRoutes);
app.use(postRoutes);

// Rota de login com validação fixa
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (email === 'professor@fiap.com' && password === '123456') {
        return res.json({
            token: 'jwt-token-valido-123',
            user: { id: 1, name: 'Professor FIAP', email }
        });
    }

    return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});