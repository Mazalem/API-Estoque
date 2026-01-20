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
            res.status(400).json({ message: "Todos os campos devem ser preenchidos" });
            return;
        }
        if (typeof nome !== "string") {
            res.status(400).json({ message: "Nome deve ser uma string" });
            return;
        }
        if (typeof id_categoria !== "string") {
            res.status(400).json({ message: "ID da categoria deve ser uma string" });
            return;
        }
        if (typeof preco !== "number") {
            res.status(400).json({ message: "Preço deve ser um número" });
            return;
        }
        if (typeof descricao !== "string") {
            res.status(400).json({ message: "Descrição deve ser uma string" });
            return;
        }
        const produto = await ProdutoService.criarProduto(nome, id_categoria, preco, descricao);
        if (!produto || !produto.produtoCriado || !produto.estoqueCriado) {
            res.status(400).json({ message: "Erro ao criar produto" });
            return;
        }
        res.status(201).json(produto.produtoCriado);
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

        if (!id) {
            res.status(400).json({ message: "ID inválido" });
            return;
        }
        if (!nome || !id_categoria || !preco || !descricao) {
            res.status(400).json({ message: "Todos os campos devem ser preenchidos" });
            return;
        }
        if (typeof nome !== "string") {
            res.status(400).json({ message: "Nome deve ser uma string" });
            return;
        }
        if (typeof preco !== "number") {
            res.status(400).json({ message: "Preço deve ser um número" });
            return;
        }
        if (typeof descricao !== "string") {
            res.status(400).json({ message: "Descrição deve ser uma string" });
            return;
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
        if (!id) {
            res.status(400).json({ message: "ID inválido" });
            return;
        }
        const produto = await ProdutoService.deletarProduto(id);
        if (!produto) {
            res.status(404).json({ message: "Produto não encontrado" });
            return;
        }else
            res.status(200).json({ message: "Produto deletado com sucesso" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao deletar produto" });
    }
};

exports.obterProdutosPorCategoria = async (req, res) => {
    try {
        const id_categoria = req.params.id_categoria;
        if (!id_categoria) {
            res.status(400).json({ message: "ID da categoria inválido" });
            return;
        }
        const produtos = await ProdutoService.obterProdutosPorCategoria(id_categoria);
        if (!produtos) {
            res.status(404).json({ message: "Nenhum produto encontrado para a categoria" });
            return;
        }
        res.status(200).json(produtos);
    } catch (error) {
        res.status(500).json({ message: "Erro ao obter produtos por categoria" });
    }
};