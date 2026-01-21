const VendaService = require("../services/VendasService");

exports.listarVendas = async (req, res) => {
    try {
        const vendas = await VendaService.listarVendas();
        if (vendas.length === 0) return res.status(404).json({ error: "Nenhuma venda encontrada" });
        res.status(200).json(vendas);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao listar vendas -> " + error.message });
    }
};

exports.criarVenda = async (req, res) => {
    try {
        const {itens} = req.body;
        if (!itens) {
            return res.status(400).json({ error: "Itens não fornecidos" });
        }
        for (const item of itens) {
            if(!item.id_produto || !item.quantidade) {
                return res.status(400).json({ error: "Item inválido" });
            }
            if(typeof item.id_produto !== "string" || typeof item.quantidade !== "number") {
                return res.status(400).json({ error: "Item inválido" });
            }
            if(item.quantidade <= 0) {
                return res.status(400).json({ error: "Quantidade inválida" });
            }
        }
        const venda = await VendaService.criarVenda(req.body);
        if (!venda) {
            return res.status(400).json({ error: "Erro ao criar venda" });
        }
        res.status(201).json(venda);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao criar venda -> " + error.message });
    }
};

exports.obterVenda = async (req, res) => {
    try {
        const {id} = req.params;
        if (!id) {
            return res.status(400).json({ error: "ID não fornecido" });
        }
        const venda = await VendaService.obterVenda(id);
        if (!venda) {
            return res.status(404).json({ error: "Venda não encontrada" });
        }
        res.status(200).json(venda);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao obter venda -> " + error.message });
    }
};

exports.atualizarVenda = async (req, res) => {
    try {
        const {id} = req.params;
        if (!id) {
            return res.status(400).json({ error: "ID não fornecido" });
        }
        const {itens} = req.body;
        if (!itens) {
            return res.status(400).json({ error: "Itens não fornecidos" });
        }
        for (const item of itens) {
            if(!item.id_produto || !item.quantidade) {
                return res.status(400).json({ error: "Item inválido" });
            }
            if(typeof item.id_produto !== "string" || typeof item.quantidade !== "number") {
                return res.status(400).json({ error: "Item inválido" });
            }
            if(item.quantidade <= 0) {
                return res.status(400).json({ error: "Quantidade inválida" });
            }
        }
        const venda = await VendaService.atualizarVenda(id, itens);
        if (!venda) {
            return res.status(404).json({ error: "Venda não encontrada" });
        }
        res.status(200).json(venda);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao atualizar venda -> " + error.message });
    }
};

exports.deletarVenda = async (req, res) => {
    try {
        const {id} = req.params;
        if (!id) {
            return res.status(400).json({ error: "ID não fornecido" });
        }
        const venda = await VendaService.deletarVenda(id);
        if (!venda) {
            return res.status(404).json({ error: "Venda não encontrada" });
        }
        res.status(200).json({ message: "Venda deletada com sucesso" });
    } catch (error) {
        res.status(500).json({ erro: "Erro ao deletar venda -> " + error.message });
    }
};