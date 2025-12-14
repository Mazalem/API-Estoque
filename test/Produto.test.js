const Produto = require('../model/Produto');
const mongodb = require('mongodb');
jest.mock('mongodb');

describe('Produto', () => {

  let mockClient;
  let mockDbInstance;
  let mockCollection;

  // -----------------------------
  // MOCK DO BANCO
  // -----------------------------
  beforeAll(() => {

    mockCollection = {
      find: jest.fn().mockReturnValue({
        toArray: jest.fn().mockResolvedValue([
          { nome: 'Produto A', descricao: 'Descrição A', preco: 100 }
        ]),
      }),
      insertOne: jest.fn().mockResolvedValue({
        ops: [{ nome: 'Produto B', descricao: 'Descrição B', preco: 200 }],
      }),
      findOne: jest.fn().mockResolvedValue({
        nome: 'Produto B',
        descricao: 'Descrição B',
        preco: 200
      }),
      updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
      deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
    };

    mockDbInstance = {
      collection: jest.fn().mockReturnValue(mockCollection)
    };

    mockClient = {
      db: jest.fn().mockReturnValue(mockDbInstance)
    };

    mongodb.MongoClient.connect.mockResolvedValue(mockClient);
  });

  // =============================================================
  // CRIAÇÃO
  // =============================================================
  describe('Criar Produto', () => {

    it('deve criar um produto com sucesso', async () => {
      const novoProduto = new Produto('Produto B', 'Descrição B', 200);
      const produtoCriado = await Produto.criarProduto(novoProduto);

      expect(produtoCriado.nome).toBe('Produto B');
      expect(produtoCriado.descricao).toBe('Descrição B');
      expect(produtoCriado.preco).toBe(200);
    });

    describe('Falhas ao criar', () => {
      it('deve falhar ao criar produto com nome inválido', () => {
        expect(() => new Produto(8, 'Descrição B', 200)).toThrow();
      });

      it('deve falhar ao criar produto com descrição inválida', () => {
        expect(() => new Produto('Produto B', 9, 200)).toThrow();
      });

      it('deve falhar ao criar produto com preço inválido', () => {
        expect(() => new Produto('Produto B', 'Descrição B', -5)).toThrow();
      });
    });

  });

  // =============================================================
  // LISTAR
  // =============================================================
  describe('Listar Produtos', () => {

    it('deve listar produtos com sucesso', async () => {
      const produtos = await Produto.listarProdutos();

      expect(produtos).toHaveLength(1);
      expect(produtos[0].nome).toBe('Produto A');
    });

    it('deve falhar se o banco retornar erro ao listar', async () => {
      mockCollection.find().toArray.mockRejectedValueOnce(new Error("Erro ao listar"));
      await expect(Produto.listarProdutos())
        .rejects
        .toThrow("Erro ao listar");
    });

  });

  // =============================================================
  // OBTER
  // =============================================================
  describe('Obter Produto', () => {

    it('deve obter um produto com sucesso', async () => {
      const produto = await Produto.obterProduto('1');

      expect(produto.nome).toBe('Produto B');
      expect(produto.descricao).toBe('Descrição B');
    });

    it('deve falhar ao tentar obter com ID inválido (ObjectId)', async () => {
      await expect(Produto.obterProduto('id inválido')).rejects.toThrow();
    });

  });

  // =============================================================
  // ATUALIZAR
  // =============================================================
  describe('Atualizar Produto', () => {

    it('deve atualizar um produto com sucesso', async () => {
      const produtoAtualizado = await Produto.atualizarProduto('1', {
        nome: 'Produto Atualizado',
        descricao: 'Descrição Atualizada',
        preco: 300,
      });
      expect(produtoAtualizado.modifiedCount).toBe(1);
    });

    it('deve falhar ao atualizar um produto inexistente', async () => {
      mockCollection.updateOne.mockResolvedValueOnce({ modifiedCount: 0 });
      const resp = await Produto.atualizarProduto('1', {
        nome: 'Teste',
        descricao: 'Teste',
        preco: 10,
      });

      expect(resp.modifiedCount).toBe(0);
    });

  });

  // =============================================================
  // DELETAR
  // =============================================================
  describe('Deletar Produto', () => {

    it('deve deletar um produto com sucesso', async () => {
      const deletado = await Produto.deletarProduto('1');
      expect(deletado.deletedCount).toBe(1);
    });

    it('deve falhar ao tentar deletar produto inexistente', async () => {

      mockCollection.deleteOne.mockResolvedValueOnce({ deletedCount: 0 });

      const resp = await Produto.deletarProduto('1');

      expect(resp.deletedCount).toBe(0);
    });

  });

});
