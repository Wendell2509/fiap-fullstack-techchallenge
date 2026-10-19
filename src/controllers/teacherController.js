const teacherRepository = require('../repositories/teacherRepository');

class TeacherController {
    async list(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            const teachers = await teacherRepository.findAll(limit, offset);
            const total = await teacherRepository.countAll();

            return res.json({
                data: teachers,
                meta: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao listar professores.' });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const teacher = await teacherRepository.findById(id);
            if (!teacher) {
                return res.status(404).json({ message: 'Professor não encontrado.' });
            }
            return res.json(teacher);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar professor.' });
        }
    }

    async create(req, res) {
        try {
            const { name, email, department } = req.body;
            if (!name || !email) {
                return res.status(400).json({ message: 'Nome e e-mail são obrigatórios.' });
            }
            const newTeacher = await teacherRepository.create({ name, email, department });
            return res.status(201).json(newTeacher);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao cadastrar professor.' });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, email, department } = req.body;
            const updated = await teacherRepository.update(id, { name, email, department });
            if (!updated) {
                return res.status(404).json({ message: 'Professor não encontrado.' });
            }
            return res.json(updated);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao atualizar professor.' });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const deleted = await teacherRepository.delete(id);
            if (!deleted) {
                return res.status(404).json({ message: 'Professor não encontrado.' });
            }
            return res.json({ message: 'Professor removido com sucesso.' });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao remover professor.' });
        }
    }
}

module.exports = new TeacherController();