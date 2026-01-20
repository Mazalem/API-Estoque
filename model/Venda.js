const DbMongo = require("../database/DbMongo");
const mongodb = require("mongodb");
const { ObjectId } = require("mongodb");

class Venda {
    constructor(itens, total) {
        if (!itens || !Array.isArray(itens)) throw new Error('Itens inválidos');
        if (typeof total !== 'number' || total < 0) throw new Error('Total inválido');
        this.data = new Date();
        this.total = total;
        this.itens = itens;
    }

    getData() { return this.data; }
    getTotal() { return this.total; }
    getItens() { return this.itens; }
    setData(data) { if(this.data instanceof Date) this.data = data; else throw new Error('Data inválida'); }
    setTotal(total) { if(typeof total === 'number' && total >= 0) this.total = total; else throw new Error('Total inválido'); }
    setItens(itens) { if(Array.isArray(itens)) this.itens = itens; else throw new Error('Itens inválidos'); }

    static async listarVendas() {
        await DbMongo.connect();
        return DbMongo.getDB().collection('vendas').find({}).toArray();
    }

    static async criarVenda(venda) {
        await DbMongo.connect();
        const resultado = await DbMongo.getDB().collection('vendas').insertOne(venda);

        return {
            _id: resultado.insertedId,
            ...venda
        };
    }

    static async obterVenda(id) {
        await DbMongo.connect();
        return DbMongo.getDB().collection('vendas').findOne({ _id: new ObjectId(id) });
    }

    static async atualizarVenda(id, venda) {
        await DbMongo.connect();
        venda.data = new Date();

        const resultado = await DbMongo.getDB()
            .collection('vendas')
            .findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: venda }
            );

        return {
            _id: id,
            ...venda
        };
    }

    static async deletarVenda(id) {
        await DbMongo.connect();

        const resultado = await DbMongo.getDB().collection('vendas')
            .deleteOne({ _id: new ObjectId(id) });

        return resultado;
    }
}

module.exports = Venda;