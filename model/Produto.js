require("dotenv").config();
const mongodb = require("mongodb");

const ClienteMongo = mongodb.MongoClient;
var cliente;

const conexao_bd = async () => {
    if (!cliente) {
        try {
            cliente = await ClienteMongo.connect(process.env.URL_BANCO, { useNewUrlParser: true, useUnifiedTopology: true });
            console.log('Conectado ao banco de dados!');
        } catch (err) {
            console.error('Erro ao conectar ao banco de dados:', err);
            throw new Error('Erro na conexão com o banco de dados');
        }
    }
};

const bd = () => {
    if (!cliente) {
        throw new Error('Cliente não está conectado ao banco de dados');
    }
    return cliente.db("api_estoque");
};

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
    await conexao_bd();
    return bd().collection('produtos').find({}).toArray();
  }

  static async criarProduto(produto) {
    await conexao_bd();
    const resultado = await bd().collection('produtos').insertOne(produto);
    return resultado.ops[0];
  }

  static async obterProduto(id) {
    await conexao_bd();
    return bd().collection('produtos').findOne({ _id: mongodb.ObjectId(id) });
  }

  static async atualizarProduto(id, produto) {
    await conexao_bd();
    return bd().collection('produtos').updateOne({ _id: mongodb.ObjectId(id) }, { $set: produto });
  }

  static async deletarProduto(id) {
    await conexao_bd();
    return bd().collection('produtos').deleteOne({ _id: mongodb.ObjectId(id) });
  }
}

module.exports = Produto;
