const EstoqueService = require('../services/EstoqueService');

exports.listarEstoque = async (req, res) => {
    try {
        const estoques = await EstoqueService.listarEstoques();
        res.status(200).json(estoques);
    } catch (error) {
        res.status(500).json({ message: "Erro ao listar estoques" });
    }
}
 
exports.getEstoque = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ message: "Dados inválidos" });
            return;
        }
        const estoque = await EstoqueService.getEstoqueByProduto(id);
        res.status(200).json(estoque);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar estoque" });
    }
}

exports.movimentarEstoque = async (req, res) => {
    try {
        const { id_produto, quantidade, tipo } = req.body;
        if (!id_produto || !quantidade || !tipo) {
           res.status(400).json({ message: "Dados inválidos" });
           return;
        }
        if (tipo !== "entrada" && tipo !== "saida") {
            res.status(400).json({ message: "Tipo inválido" });
            return;
        }
        if (typeof quantidade !== "number" || !Number.isInteger(quantidade)) {
            res.status(400).json({ message: "Quantidade inválida" });
            return;
        }
        const estoque = await EstoqueService.movimentarEstoque(id_produto, quantidade, tipo);
        if (!estoque) {
            res.status(404).json({ message: "Estoque não encontrado" });
            return;
        }
        res.status(200).json(estoque);
    } catch (error) {
        res.status(500).json({ message: "Erro ao movimentar estoque" });
    }
}