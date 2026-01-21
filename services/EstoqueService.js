const Estoque = require('../model/Estoque');

exports.listarEstoques = async () => {
    try {
        return await Estoque.listarEstoques();
    } catch (error) {
        console.log(error);
        throw error;
    }
}

exports.getEstoque = async (id) => {
    try {
        return await Estoque.getEstoque(id);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

exports.getEstoqueByProduto = async (id) => {
    try {
        return await Estoque.getEstoqueByProduto(id);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

exports.movimentacaoPossivel = async (id_produto, quantidade, tipo) => {
    try {
        const estoqueExiste = await Estoque.getEstoqueByProduto(id_produto);
        if (!estoqueExiste) {
            return null;
        }
        if (tipo === "saida") {
            quantidade = -quantidade;
            if ((estoqueExiste.quantidade + quantidade) < 0) {
                return false;
            }
        }
        return true;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

exports.movimentarEstoque = async (id_produto, quantidade, tipo) => {
    try {
        const estoqueExiste = await Estoque.getEstoqueByProduto(id_produto);
        if (!estoqueExiste) {
            return null;
        }
        if (tipo === "saida") {
            quantidade = -quantidade;
            if (estoqueExiste.quantidade + quantidade < 0) {
                throw new Error("Estoque insuficiente");
            }
        }
        return await Estoque.movimentarEstoque(id_produto, quantidade);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

exports.deletarEstoque = async (id) => {
    try {
        const estoqueExiste = await this.getEstoque(id);
        if (!estoqueExiste) {
            return null;
        }
        return await Estoque.deletarEstoque(id);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

exports.criarEstoque = async (id_produto) => {
    try {
        if (!id_produto) {
            throw new Error("ID do produto inválido");
        }
        const estoque = new Estoque(id_produto);
        return await Estoque.criarEstoque(estoque);
    } catch (error) {
        console.log(error);
        throw error;
    }
}