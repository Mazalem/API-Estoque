const categoriasService = require('../services/CategoriasService');

exports.listarCategorias = async (req, res) => {
    try {
        const categorias = await categoriasService.listarCategorias();
        if (categorias.length === 0) return res.status(200).json({ mensagem: "Nenhuma categoria cadastrada" });
        res.status(200).json(categorias);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao listar categorias -> " + err.message });
    }
};

exports.criarCategoria = async (req, res) => {
    try {
        const { nome } = req.body;
        if (!nome || typeof nome !== "string") return res.status(400).json({ erro: "Campo 'nome' é obrigatório e deve ser uma string" });
        const novaCategoria = await categoriasService.criarCategoria(nome);
        res.status(201).json(novaCategoria);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao criar categoria -> " + err.message });
    }
};

exports.buscarCategoriaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ erro: "Campo 'id' é obrigatório" });
        const categoria = await categoriasService.buscarCategoriaPorId(id);
        if (!categoria) return res.status(404).json({ mensagem: "Categoria não encontrada" });
        res.status(200).json(categoria);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao buscar categoria -> " + err.message });
    }
};

exports.atualizarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome } = req.body;

        if (!nome || !id || typeof nome !== "string") return res.status(400).json({ erro: "Campo 'nome' e 'id' são obrigatórios e 'nome' deve ser uma string" });

        const categoriaAtualizada = await categoriasService.atualizarCategoria(id, nome);
        if (!categoriaAtualizada) return res.status(404).json({ mensagem: "Categoria não encontrada" });
        res.status(200).json(categoriaAtualizada);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao atualizar categoria -> " + err.message });
    }
};

exports.removerCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ erro: "Campo 'id' é obrigatório" });
        const removido = await categoriasService.removerCategoria(id);
        if (!removido) return res.status(404).json({ mensagem: "Categoria não encontrada" });
        res.status(200).json({ mensagem: "Categoria removida com sucesso" });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao remover categoria -> " + err.message });
    }
};
