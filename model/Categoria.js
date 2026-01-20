const mongodb = require("mongodb");
const DbMongo = require("../database/DbMongo");
const { ObjectId } = require("mongodb");

class Categoria {
    constructor(nome) {
        if (!nome || typeof nome !== 'string') throw new Error('Nome inválido');
        this.nome = nome;
    }

    getNome() { return this.nome; }
    setNome(nome) { if (!nome || typeof nome !== 'string') throw new Error('Nome inválido'); this.nome = nome; }

    static async listarCategorias() {
        await DbMongo.connect();
        return DbMongo.getDB().collection('categorias').find({}).toArray();
    }

    static async criarCategoria(categoria) {
        await DbMongo.connect();
        const resultado = await DbMongo.getDB().collection('categorias').insertOne(categoria);
        return { _id: resultado.insertedId,...categoria };
    }

    static async buscarCategoriaPorId(id_categoria) {
        await DbMongo.connect();
        return DbMongo.getDB().collection('categorias').findOne({ _id: new ObjectId(id_categoria) });
    }

    static async atualizarCategoria(id_categoria, categoria) {
        await DbMongo.connect();
        const result = await DbMongo.getDB().collection('categorias').updateOne({ _id: new ObjectId(id_categoria) }, { $set: categoria });
        if (result.matchedCount > 0) {
            return { _id: id_categoria, ...categoria };
        }
        return null;
    }

    static async removerCategoria(id_categoria) {
        await DbMongo.connect();
        const result = await DbMongo.getDB().collection('categorias').deleteOne({ _id: new ObjectId(id_categoria) });
        return result.deletedCount > 0;
    }
}

module.exports = Categoria;
