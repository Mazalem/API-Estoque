const Produto = require("../model/Produto");

exports.listarProdutos = async () => {
    return await Produto.listarProdutos();
};

exports.criarProduto = async (nome, id_categoria, preco, descricao) => {
    const produto = new Produto(nome, id_categoria, preco, descricao);
    return await Produto.criarProduto(produto);
};

exports.obterProduto = async (id) => {
    return await Produto.obterProduto(id);
};

exports.atualizarProduto = async (id, produto) => {
    const produtoExiste = await this.obterProduto(id);
    if (!produtoExiste) {
        return null;
    }
    const produtoAtualizado = new Produto(produto.nome, produto.id_categoria, produto.preco, produto.descricao);
    return await Produto.atualizarProduto(id, produtoAtualizado);
};

exports.deletarProduto = async (id) => {
    const produtoExiste = await this.obterProduto(id);
    if (!produtoExiste) {
        return null;
    }
    return await Produto.deletarProduto(id);
};

exports.obterProdutosPorCategoria = async (id_categoria) => {
    return await Produto.obterProdutosPorCategoria(id_categoria);
};
