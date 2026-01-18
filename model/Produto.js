require("dotenv").config();
const DbMongo = require("../database/DbMongo");
const mongodb = require("mongodb");

class Produto {
  constructor(nome, id_categoria, preco, descricao) {
    if (!nome || typeof nome !== 'string') throw new Error('Nome inválido');
    if (!id_categoria || typeof id_categoria !== 'string') throw new Error('ID da categoria inválido');
    if (typeof preco !== 'number' || preco < 0) throw new Error('Preço inválido');
    if (!descricao || typeof descricao !== 'string') throw new Error('Descrição inválida');

    this.nome = nome;
    this.id_categoria = id_categoria;
    this.preco = preco;
    this.descricao = descricao;
  }

  getNome() { return this.nome; }
  getIdCategoria() { return this.id_categoria; }
  getPreco() { return this.preco; }
  getDescricao() { return this.descricao; }
  setNome(nome) { if (!nome || typeof nome !== 'string') throw new Error('Nome inválido'); this.nome = nome; }
  setIdCategoria(id_categoria) { if (!id_categoria || typeof id_categoria !== 'string') throw new Error('ID da categoria inválido'); this.id_categoria = id_categoria; }
  setPreco(preco) { if (typeof preco !== 'number' || preco < 0) throw new Error('Preço inválido'); this.preco = preco; }
  setDescricao(descricao) { if (!descricao || typeof descricao !== 'string') throw new Error('Descrição inválida'); this.descricao = descricao; }

  static async listarProdutos() {
    await DbMongo.connect();
    return DbMongo.getDB().collection('produtos').find({}).toArray();
  }

  static async criarProduto(produto) {
    await DbMongo.connect();
    const resultado = await DbMongo.getDB().collection('produtos').insertOne(produto);

    return {
      _id: resultado.insertedId,
      ...produto
    };
  }

  static async obterProduto(id) {
    await DbMongo.connect();
    return DbMongo.getDB().collection('produtos').findOne({ _id: mongodb.ObjectId(id) });
  }

  static async atualizarProduto(id, produto) {
    await DbMongo.connect();

    const result = await DbMongo.getDB()
      .collection('produtos')
      .findOneAndUpdate(
        { _id: new mongodb.ObjectId(id) },
        { $set: produto },
        { returnDocument: 'after' }
      );

    return result.value;
  }

  static async deletarProduto(id) {
    await DbMongo.connect();

    const resultado = await DbMongo.getDB().collection('produtos')
      .deleteOne({ _id: new mongodb.ObjectId(id) });

    return resultado.deletedCount === 1;
  }

  static async obterProdutosPorCategoria(id_categoria) {
    await DbMongo.connect();
    return DbMongo.getDB().collection('produtos').find({ id_categoria }).toArray();
  }

}

module.exports = Produto;
