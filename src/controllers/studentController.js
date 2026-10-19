const studentRepository = require('../repositories/studentRepository');

class StudentController {
    async list(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            const students = await studentRepository.findAll(limit, offset);
            const total = await studentRepository.countAll();

            return res.json({
                data: students,
                meta: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao listar estudantes.' });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const student = await studentRepository.findById(id);
            if (!student) {
                return res.status(404).json({ message: 'Estudante não encontrado.' });
            }
            return res.json(student);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar estudante.' });
        }
    }

    async create(req, res) {
        try {
            const { name, email, registration_number } = req.body;
            if (!name || !email || !registration_number) {
                return res.status(400).json({ message: 'Nome, e-mail e matrícula são obrigatórios.' });
            }
            const newStudent = await studentRepository.create({ name, email, registration_number });
            return res.status(201).json(newStudent);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao cadastrar estudante.' });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, email, registration_number } = req.body;
            const updated = await studentRepository.update(id, { name, email, registration_number });
            if (!updated) {
                return res.status(404).json({ message: 'Estudante não encontrado.' });
            }
            return res.json(updated);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao atualizar estudante.' });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const deleted = await studentRepository.delete(id);
            if (!deleted) {
                return res.status(404).json({ message: 'Estudante não encontrado.' });
            }
            return res.json({ message: 'Estudante removido com sucesso.' });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao remover estudante.' });
        }
    }
}

module.exports = new StudentController();