const { Router } = require('express');
const studentController = require('../controllers/studentController');
const { authMiddleware, authorizeRole } = require('../middlewares/authMiddleware');

const router = Router();

// Apenas professores autenticados podem visualizar e gerenciar estudantes
router.get('/students', authMiddleware, authorizeRole('teacher'), studentController.list);
router.get('/students/:id', authMiddleware, authorizeRole('teacher'), studentController.getById);
router.post('/students', authMiddleware, authorizeRole('teacher'), studentController.create);
router.put('/students/:id', authMiddleware, authorizeRole('teacher'), studentController.update);
router.delete('/students/:id', authMiddleware, authorizeRole('teacher'), studentController.delete);

module.exports = router;