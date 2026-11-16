
const postRepository = require('../repositories/postRepository');

class PostController {

    // CRIAR POST
    async create(req, res) {
        try {
            const { title, content, author } = req.body;

            if (!title || !content || !author) {
                return res.status(400).json({
                    error: 'Campos obrigatórios ausentes: title, content e author.'
                });
            }

            const newPost = await postRepository.create({
                title,
                content,
                author
            });

            return res.status(201).json(newPost);
        } catch (error) {
            console.error('Erro ao criar post:', error);
            return res.status(500).json({
                error: 'Erro ao criar post.'
            });
        }
    }

    // LISTAR POSTS COM PAGINAÇÃO
    async list(req, res) {
        try {
            const page = Math.max(1, parseInt(req.query.page, 10) || 1);
            const limit = Math.min(
                50,
                Math.max(1, parseInt(req.query.limit, 10) || 10)
            );

            const offset = (page - 1) * limit;

            const posts = await postRepository.findAll(limit, offset);
            const total = await postRepository.countAll();

            return res.status(200).json({
                data: posts,
                meta: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            console.error('Erro ao listar posts:', error);
            return res.status(500).json({
                error: 'Erro ao listar posts.'
            });
        }
    }

    // PESQUISAR POSTS COM PAGINAÇÃO
    async search(req, res) {
        try {
            const { term } = req.query;

            if (!term || !term.trim()) {
                return res.status(400).json({
                    error: 'O termo de busca é obrigatório.'
                });
            }

            const page = Math.max(1, parseInt(req.query.page, 10) || 1);
            const limit = Math.min(
                50,
                Math.max(1, parseInt(req.query.limit, 10) || 10)
            );

            const offset = (page - 1) * limit;

            const posts = await postRepository.searchPosts(
                term.trim(),
                limit,
                offset
            );

            const total = await postRepository.countSearch(term.trim());

            return res.status(200).json({
                data: posts,
                meta: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            console.error('Erro ao buscar posts:', error);
            return res.status(500).json({
                error: 'Erro ao buscar posts.'
            });
        }
    }

    // BUSCAR POST POR ID
    async getById(req, res) {
        try {
            const post = await postRepository.findById(req.params.id);

            if (!post) {
                return res.status(404).json({
                    error: 'Post não encontrado.'
                });
            }

            return res.status(200).json(post);
        } catch (error) {
            console.error('Erro ao buscar post:', error);
            return res.status(500).json({
                error: 'Erro ao buscar post.'
            });
        }
    }

    // ATUALIZAR POST
    async update(req, res) {
        try {
            const { title, content, author } = req.body;

            const updated = await postRepository.update(
                req.params.id,
                { title, content, author }
            );

            if (!updated) {
                return res.status(404).json({
                    error: 'Post não encontrado.'
                });
            }

            return res.status(200).json(updated);
        } catch (error) {
            console.error('Erro ao atualizar post:', error);
            return res.status(500).json({
                error: 'Erro ao atualizar post.'
            });
        }
    }

    // EXCLUIR POST
    async delete(req, res) {
        try {
            const success = await postRepository.delete(req.params.id);

            if (!success) {
                return res.status(404).json({
                    error: 'Post não encontrado.'
                });
            }

            return res.status(200).json({
                message: 'Post deletado com sucesso.'
            });
        } catch (error) {
            console.error('Erro ao deletar post:', error);
            return res.status(500).json({
                error: 'Erro ao deletar post.'
            });
        }
    }
}

module.exports = new PostController();
