const Produto = require("../model/Produto");
const EstoqueService = require("./EstoqueService");

exports.listarProdutos = async () => {
    try {
        return await Produto.listarProdutos();
    } catch (error) {
        console.log(error);
        throw error;
    }
};

exports.criarProduto = async (nome, id_categoria, preco, descricao) => {
    try {
        const produto = new Produto(nome, id_categoria, preco, descricao);
        produto = await Produto.criarProduto(produto);
        await EstoqueService.criarEstoque(produto._id);
        return produto;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

exports.obterProduto = async (id) => {
    try {
        return await Produto.obterProduto(id);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

exports.atualizarProduto = async (id, produto) => {
    try {
        const produtoExiste = await this.obterProduto(id);
        if (!produtoExiste) {
            return null;
        }
        const produtoAtualizado = new Produto(produto.nome, produto.id_categoria, produto.preco, produto.descricao);
        return await Produto.atualizarProduto(id, produtoAtualizado);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

exports.deletarProduto = async (id) => {
    try {
        const produtoExiste = await this.obterProduto(id);
        if (!produtoExiste) {
            return null;
        }
        return await Produto.deletarProduto(id);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

exports.obterProdutosPorCategoria = async (id_categoria) => {
    try {
        return await Produto.obterProdutosPorCategoria(id_categoria);
    } catch (error) {
        console.log(error);
        throw error;
    }
};
