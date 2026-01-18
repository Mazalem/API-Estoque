const ProdutoService = require("../services/ProdutoService");

exports.listarProdutos = async (req, res) => {
    try {
        const produtos = await ProdutoService.listarProdutos();
        res.status(200).json(produtos);
    } catch (error) {
        res.status(500).json({ message: "Erro ao listar produtos" });
    }
};

exports.criarProduto = async (req, res) => {
    try {
        const { nome, id_categoria, preco, descricao } = req.body;
        if (!nome || !id_categoria || !preco || !descricao) {
            return res.status(400).json({ message: "Todos os campos devem ser preenchidos" });
        }
        if (typeof nome !== "string") {
            return res.status(400).json({ message: "Nome deve ser uma string" });
        }
        if (typeof id_categoria !== "string") {
            return res.status(400).json({ message: "ID da categoria deve ser uma string" });
        }
        if (typeof preco !== "number") {
            return res.status(400).json({ message: "Preço deve ser um número" });
        }
        if (typeof descricao !== "string") {
            return res.status(400).json({ message: "Descrição deve ser uma string" });
        }
        const produto = await ProdutoService.criarProduto(nome, id_categoria, preco, descricao);
        res.status(201).json(produto);
    } catch (error) {
        res.status(500).json({ message: "Erro ao criar produto" });
    }
};

exports.obterProduto = async (req, res) => {
    try {
        const produto = await ProdutoService.obterProduto(req.params.id);
        res.status(200).json(produto);
    } catch (error) {
        res.status(500).json({ message: "Erro ao obter produto" });
    }
};

exports.atualizarProduto = async (req, res) => {
    try {
        const { nome, id_categoria, preco, descricao } = req.body;
        const id = req.params.id;

        if (!id || typeof id !== "string") {
            return res.status(400).json({ message: "ID inválido" });
        }
        if (!nome || !id_categoria || !preco || !descricao) {
            return res.status(400).json({ message: "Todos os campos devem ser preenchidos" });
        }
        if (typeof nome !== "string") {
            return res.status(400).json({ message: "Nome deve ser uma string" });
        }
        if (typeof id_categoria !== "string") {
            return res.status(400).json({ message: "ID da categoria deve ser uma string" });
        }
        if (typeof preco !== "number") {
            return res.status(400).json({ message: "Preço deve ser um número" });
        }
        if (typeof descricao !== "string") {
            return res.status(400).json({ message: "Descrição deve ser uma string" });
        }

        const produto = await ProdutoService.atualizarProduto(id, { nome, id_categoria, preco, descricao });
        if (!produto) {
            return res.status(404).json({ message: "Produto não encontrado" });
        }
        res.status(201).json(produto);
    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar produto" });
    }
};

exports.deletarProduto = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id || typeof id !== "string") {
            return res.status(400).json({ message: "ID inválido" });
        }
        const produto = await ProdutoService.deletarProduto(id);
        if (!produto) {
            return res.status(404).json({ message: "Produto não encontrado" });
        }
        res.status(204).json({ message: "Produto deletado com sucesso" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao deletar produto" });
    }
};

exports.obterProdutosPorCategoria = async (req, res) => {
    try {
        const id_categoria = req.params.id_categoria;
        if (!id_categoria || typeof id_categoria !== "string") {
            return res.status(400).json({ message: "ID da categoria inválido" });
        }
        const produtos = await ProdutoService.obterProdutosPorCategoria(id_categoria);
        if (!produtos) {
            return res.status(404).json({ message: "Nenhum produto encontrado para a categoria" });
        }
        res.status(200).json(produtos);
    } catch (error) {
        res.status(500).json({ message: "Erro ao obter produtos por categoria" });
    }
};