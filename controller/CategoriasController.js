const categoriasService = require('../services/CategoriasService');

const listar = async (req, res) => {
    try {
        const categorias = await categoriasService.listar();
        res.status(200).json(categorias);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

const criar = async (req, res) => {
    const { nome } = req.body;
    if (!nome) {
        return res.status(400).json({ erro: "Campo 'nome' é obrigatório" });
    }

    try {
        const novaCategoria = await categoriasService.criar({ nome });
        res.status(201).json(novaCategoria);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

const buscarPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const categoria = await categoriasService.buscarPorId(id);

        if (!categoria) {
            return res.status(404).json({ mensagem: "Categoria não encontrada" });
        }

        res.status(200).json(categoria);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

const atualizar = async (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;

    if (!nome) {
        return res.status(400).json({ erro: "Campo 'nome' é obrigatório" });
    }

    try {
        const categoriaAtualizada = await categoriasService.atualizar(id, { nome });

        if (!categoriaAtualizada) {
            return res.status(404).json({ mensagem: "Categoria não encontrada" });
        }

        res.status(200).json(categoriaAtualizada);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

const remover = async (req, res) => {
    const { id } = req.params;
    try {
        const removido = await categoriasService.remover(id);

        if (!removido) {
            return res.status(404).json({ mensagem: "Categoria não encontrada" });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

module.exports = {
    listar,
    criar,
    buscarPorId,
    atualizar,
    remover
};
