const { Router } = require('express');
const postController = require('../controllers/postController');
const authMiddleware = require('../../middlewares/authMiddleware');
const router = Router();

// Rotas públicas (leitura)
router.get('/posts/search', postController.search);
router.get('/posts', postController.list);
router.get('/posts/:id', postController.getById);

// Rotas protegidas (escrita - requerem token JWT)
router.post('/posts', authMiddleware, postController.create);
router.put('/posts/:id', authMiddleware, postController.update);
router.delete('/posts/:id', authMiddleware, postController.delete);

module.exports = router;