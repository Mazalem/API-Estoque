const DbMongo = require("../database/DbMongo");
const mongodb = require("mongodb");
const { ObjectId } = require("mongodb");

class Estoque {
  constructor(id_produto) {
    if (!id_produto || !ObjectId.isValid(id_produto)) {
      throw new Error("ID do produto inválido");
    }

    this.id_produto =
      typeof id_produto === "string"
        ? new ObjectId(id_produto)
        : id_produto;

    this.quantidade = 0;
  }

  getIdProduto() { return this.id_produto; }
  getQuantidade() { return this.quantidade; }
  setIdProduto(id_produto) { if (!id_produto || typeof id_produto !== "string") throw new Error("ID do produto inválido"); this.id_produto = id_produto; }
  setQuantidade(quantidade) { if (typeof quantidade !== "number" || !Number.isInteger(quantidade) || quantidade < 0) throw new Error("Quantidade inválida"); this.quantidade = quantidade; }

  static async listarEstoques() {
    await DbMongo.connect();
    return DbMongo.getDB().collection("estoque").find({}).toArray();
  }

  static async getEstoque(id) {
    await DbMongo.connect();
    return DbMongo.getDB()
      .collection("estoque")
      .findOne({ _id: new ObjectId(id) });
  }

  static async getEstoqueByProduto(id) {
    await DbMongo.connect();
    return DbMongo.getDB()
      .collection("estoque")
      .findOne({ id_produto: new ObjectId(id) });
  }

  static async movimentarEstoque(id, quantidade) {
    await DbMongo.connect();

    const resultado = await DbMongo.getDB()
      .collection("estoque")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $inc: { quantidade } }
      );

    return resultado;
  }

  static async deletarEstoque(id) {
    await DbMongo.connect();
    const resultado = await DbMongo.getDB().collection("estoque").deleteOne({ _id: new ObjectId(id) });
    return resultado.deletedCount == 1;
  }

  static async criarEstoque(estoque) {
    await DbMongo.connect();
    const resultado = await DbMongo.getDB().collection("estoque").insertOne(estoque);

    return {
      _id: resultado.insertedId,
      ...estoque
    };
  }
}

module.exports = Estoque;
