const mongodb = require("mongodb");
const EstoqueMongo = require("../database/EstoqueMongo");

class Categoria {
    constructor(nome, _id) {
        if (!nome || typeof nome !== 'string') throw new Error('Nome inválido');

        this.nome = nome;
        this._id = _id;
    }

    getNome() { return this.nome; }
    setNome(nome) { if (!nome || typeof nome !== 'string') throw new Error('Nome inválido'); this.nome = nome; }

    static async listar() {
        await EstoqueMongo.connect();
        return EstoqueMongo.getDB().collection('categorias').find({}).toArray();
    }

    static async criar(categoria) {
        await EstoqueMongo.connect();
        const resultado = await EstoqueMongo.getDB().collection('categorias').insertOne(categoria);
        return { ...categoria, _id: resultado.insertedId };
    }

    static async buscarPorId(id) {
        await EstoqueMongo.connect();
        return EstoqueMongo.getDB().collection('categorias').findOne({ _id: new mongodb.ObjectId(id) });
    }

    static async atualizar(id, dados) {
        await EstoqueMongo.connect();
        const result = await EstoqueMongo.getDB().collection('categorias').updateOne({ _id: new mongodb.ObjectId(id) }, { $set: dados });
        if (result.matchedCount > 0) {
            return { _id: id, ...dados };
        }
        return null;
    }

    static async remover(id) {
        await EstoqueMongo.connect();
        const result = await EstoqueMongo.getDB().collection('categorias').deleteOne({ _id: new mongodb.ObjectId(id) });
        return result.deletedCount > 0;
    }
}

module.exports = Categoria;
