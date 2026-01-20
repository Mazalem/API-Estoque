const Venda = require("../model/Venda");
const ProdutoService = require("./ProdutoService");
const EstoqueService = require("./EstoqueService");

exports.listarVendas = async () => {
    try{
        return await Venda.listarVendas();
    }catch(error){
        console.log(error);
        throw error;
    }
};

exports.criarVenda = async (venda) => {
    try {
        const itens = venda.itens;
        let total = 0;

        for (const produtos of itens) {
            const produto = await ProdutoService.obterProduto(produtos.id_produto);
            if (!produto) {
                return null;
            }
            const estoqueMovimentacao = await EstoqueService.movimentacaoPossivel(produtos.id_produto, produtos.quantidade, "saida");
            if (!estoqueMovimentacao) {
                return null;
            }
        }

        for (const element of itens) {
            const produto = await ProdutoService.obterProduto(element.id_produto);
            await EstoqueService.movimentarEstoque(element.id_produto, element.quantidade, "saida");

            element.preco_unitario = produto.preco;
            total += produto.preco * element.quantidade;
        }

        const vendaFinal = new Venda(itens, total);
        return await Venda.criarVenda(vendaFinal);

    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.obterVenda = async (id) => {
    try{
        return await Venda.obterVenda(id);
    }catch(error){
        console.log(error);
        throw error;
    }
};

exports.atualizarVenda = async (id, itens) => {
    try{
        const vendaAntiga = await this.obterVenda(id);
        let total = 0;
        if (!vendaAntiga) {
            return null;
        }
        for (const element of vendaAntiga.itens) {
            await EstoqueService.movimentarEstoque(element.id_produto, element.quantidade, "entrada");
        }
        
        for (const produtos of itens) {
            const produto = await ProdutoService.obterProduto(produtos.id_produto);
            if (!produto) {
                return null;
            }
            const estoqueMovimentacao = await EstoqueService.movimentacaoPossivel(produtos.id_produto, produtos.quantidade, "saida");
            if (!estoqueMovimentacao) {
                return null;
            }
        }

        for (const element of itens) {
            const produto = await ProdutoService.obterProduto(element.id_produto);
            await EstoqueService.movimentarEstoque(element.id_produto, element.quantidade, "saida");

            element.preco_unitario = produto.preco;
            total += produto.preco * element.quantidade;
        }

        const vendaAtualizada = new Venda(itens, total);
        return await Venda.atualizarVenda(id, vendaAtualizada);
    }catch(error){
        console.log(error);
        throw error;
    }
};

exports.deletarVenda = async (id) => {
    try{
        const vendaAntiga = await this.obterVenda(id);
        if (!vendaAntiga) {
            return null;
        }
        for (const element of vendaAntiga.itens) {
            await EstoqueService.movimentarEstoque(element.id_produto, element.quantidade, "entrada");
        }
        const resultado = await Venda.deletarVenda(id);
        if(resultado.deletedCount === 1){
            return true;
        }
        return false;
    }catch(error){
        console.log(error);
        throw error;
    }
};