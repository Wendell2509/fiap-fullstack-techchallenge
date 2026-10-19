const { Router } = require('express');
const teacherController = require('../controllers/teacherController');
const { authMiddleware, authorizeRole } = require('../middlewares/authMiddleware');

const router = Router();

// Apenas utilizadores autenticados com perfil de professor ('teacher') têm acesso
router.get('/teachers', authMiddleware, authorizeRole('teacher'), teacherController.list);
router.get('/teachers/:id', authMiddleware, authorizeRole('teacher'), teacherController.getById);
router.post('/teachers', authMiddleware, authorizeRole('teacher'), teacherController.create);
router.put('/teachers/:id', authMiddleware, authorizeRole('teacher'), teacherController.update);
router.delete('/teachers/:id', authMiddleware, authorizeRole('teacher'), teacherController.delete);

module.exports = router;