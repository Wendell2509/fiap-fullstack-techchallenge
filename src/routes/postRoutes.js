const { Router } = require('express');
const postController = require('../controllers/postController');
// Importar o authMiddleware e o authorizeRole
const { authMiddleware, authorizeRole } = require('../middlewares/authMiddleware');

const router = Router();

// Rotas públicas (leitura - tanto alunos como professores podem aceder)
router.get('/posts/search', postController.search);
router.get('/posts', postController.list);
router.get('/posts/:id', postController.getById);

// Rotas protegidas (escrita - requerem token JWT válido E perfil de 'teacher')
router.post('/posts', authMiddleware, authorizeRole('teacher'), postController.create);
router.put('/posts/:id', authMiddleware, authorizeRole('teacher'), postController.update);
router.delete('/posts/:id', authMiddleware, authorizeRole('teacher'), postController.delete);

module.exports = router;