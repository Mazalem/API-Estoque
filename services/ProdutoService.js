const Produto = require("../model/Produto");
const EstoqueService = require("./EstoqueService");
const CategoriaService = require("./CategoriasService");

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
        const categoria = await CategoriaService.buscarCategoriaPorId(id_categoria);
        if (!categoria) return null;
        
        const produto = new Produto(nome, categoria._id, preco, descricao);
        const produtoCriado = await Produto.criarProduto(produto);
        const estoqueCriado = await EstoqueService.criarEstoque(produtoCriado._id);
        if (estoqueCriado) {
            return { produtoCriado, estoqueCriado };
        }
        await Produto.deletarProduto(produtoCriado._id);
        return null;
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
        const estoque = await EstoqueService.getEstoqueByProduto(id);
        if (estoque) {
            await EstoqueService.deletarEstoque(estoque._id);
        }
        const resposta = await Produto.deletarProduto(id);
        if(resposta.deletedCount === 1){
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

exports.obterProdutosPorCategoria = async (id_categoria) => {
    try {
        const categoriaExiste = await CategoriaService.buscarCategoriaPorId(id_categoria);
        if (!categoriaExiste) return null;
        return await Produto.obterProdutosPorCategoria(id_categoria);
    } catch (error) {
        console.log(error);
        throw error;
    }
};
