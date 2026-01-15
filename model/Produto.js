require("dotenv").config();
const EstoqueMongo = require("../database/EstoqueMongo");
const mongodb = require("mongodb");

class Produto {
  constructor(nome, descricao, preco, _id) {
    if (!nome || typeof nome !== 'string') throw new Error('Nome inválido');
    if (!descricao || typeof descricao !== 'string') throw new Error('Descrição inválida');
    if (typeof preco !== 'number' || preco < 0) throw new Error('Preço inválido');

    this.nome = nome;
    this.descricao = descricao;
    this.preco = preco;
    this._id = _id;
  }

  getNome() { return this.nome; }
  getDescricao() { return this.descricao; }
  getPreco() { return this.preco; }
  setNome(nome) { if (!nome || typeof nome !== 'string') throw new Error('Nome inválido'); this.nome = nome; }
  setDescricao(descricao) { if (!descricao || typeof descricao !== 'string') throw new Error('Descrição inválida'); this.descricao = descricao; }
  setPreco(preco) { if (typeof preco !== 'number' || preco < 0) throw new Error('Preço inválido'); this.preco = preco; }

  static async listarProdutos() {
    await EstoqueMongo.connect();
    return EstoqueMongo.getDB().collection('produtos').find({}).toArray();
  }

  static async criarProduto(produto) {
    await EstoqueMongo.connect();
    const resultado = await EstoqueMongo.getDB().collection('produtos').insertOne(produto);
    return resultado.ops[0];
  }

  static async obterProduto(id) {
    await EstoqueMongo.connect();
    return EstoqueMongo.getDB().collection('produtos').findOne({ _id: mongodb.ObjectId(id) });
  }

  static async atualizarProduto(id, produto) {
    await EstoqueMongo.connect();
    return EstoqueMongo.getDB().collection('produtos').updateOne({ _id: mongodb.ObjectId(id) }, { $set: produto });
  }

  static async deletarProduto(id) {
    await EstoqueMongo.connect();
    return EstoqueMongo.getDB().collection('produtos').deleteOne({ _id: mongodb.ObjectId(id) });
  }
}

module.exports = Produto;
