const categoriasService = require('../services/CategoriasService');

exports.listarCategorias = async (req, res) => {
    try {
        const categorias = await categoriasService.listarCategorias();
        res.status(200).json(categorias);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.criarCategoria = async (req, res) => {
    try {
        const { nome } = req.body;
        if (!nome) return res.status(400).json({ erro: "Campo 'nome' é obrigatório" });
        const novaCategoria = await categoriasService.criarCategoria(nome);
        res.status(201).json(novaCategoria);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.buscarCategoriaPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const categoria = await categoriasService.buscarCategoriaPorId(id);
        if (!categoria) return res.status(404).json({ mensagem: "Categoria não encontrada" });
        res.status(200).json(categoria);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.atualizarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome } = req.body;

        if (!nome || !id) return res.status(400).json({ erro: "Campo 'nome' e 'id' são obrigatórios" });
        if (typeof nome !== "string") return res.status(400).json({ erro: "Campo 'nome' deve ser uma string" });

        const categoriaAtualizada = await categoriasService.atualizarCategoria(id, { nome });
        if (!categoriaAtualizada) return res.status(404).json({ mensagem: "Categoria não encontrada" });
        res.status(200).json(categoriaAtualizada);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.removerCategoria = async (req, res) => {
    const { id } = req.params;
    try {
        const removido = await categoriasService.removerCategoria(id);
        if (!removido) return res.status(404).json({ mensagem: "Categoria não encontrada" });
        res.status(200).json({ message: "Categoria removida com sucesso" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};
