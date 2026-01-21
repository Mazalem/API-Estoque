const EstoqueService = require('../services/EstoqueService');

exports.listarEstoque = async (req, res) => {
    try {
        const estoques = await EstoqueService.listarEstoques();
        if (estoques.length === 0) return res.status(200).json({ mensagem: "Nenhum estoque cadastrado" });
        res.status(200).json(estoques);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao listar estoques -> " + error.message });
    }
}
 
exports.getEstoque = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ mensagem: "Dados inválidos" });
            return;
        }
        const estoque = await EstoqueService.getEstoqueByProduto(id);
        if (!estoque) {
            res.status(404).json({ mensagem: "Estoque não encontrado" });
            return;
        }
        res.status(200).json(estoque);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao obter estoque -> " + error.message });
    }
}

exports.movimentarEstoque = async (req, res) => {
    try {
        const { id_produto, quantidade, tipo } = req.body;
        if (!id_produto || !quantidade || !tipo) {
           res.status(400).json({ mensagem: "Dados inválidos" });
           return;
        }
        if (tipo !== "entrada" && tipo !== "saida") {
            res.status(400).json({ mensagem: "Tipo inválido" });
            return;
        }
        if (typeof quantidade !== "number" || !Number.isInteger(quantidade)) {
            res.status(400).json({ mensagem: "Quantidade inválida" });
            return;
        }
        const estoque = await EstoqueService.movimentarEstoque(id_produto, quantidade, tipo);
        if (!estoque) {
            res.status(404).json({ mensagem: "Estoque não encontrado" });
            return;
        }
        res.status(200).json(estoque);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao movimentar estoque -> " + error.message });
    }
}