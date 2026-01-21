const ProdutoController = require('../controller/ProdutoController');
const ProdutoService = require('../services/ProdutoService');

jest.mock('../services/ProdutoService');

describe('ProdutoController Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      body: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('listarProdutos', () => {
    it('deve retornar lista de produtos e status 200', async () => {
      const mockProdutos = [{ _id: '1', nome: 'Produto A' }];
      ProdutoService.listarProdutos.mockResolvedValue(mockProdutos);

      await ProdutoController.listarProdutos(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProdutos);
      expect(ProdutoService.listarProdutos).toHaveBeenCalledTimes(1);
    });

    it('deve retornar status 500 em erro', async () => {
      ProdutoService.listarProdutos.mockRejectedValue(new Error('Erro'));

      await ProdutoController.listarProdutos(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao listar produtos' });
    });
  });

  describe('criarProduto', () => {
    it('deve criar produto e retornar status 201', async () => {
      req.body = {
        nome: 'Produto B',
        id_categoria: 'cat1',
        preco: 100,
        descricao: 'Desc B'
      };
      const mockResultado = {
        produtoCriado: { _id: '2', ...req.body },
        estoqueCriado: { _id: 'est1' }
      };
      ProdutoService.criarProduto.mockResolvedValue(mockResultado);

      await ProdutoController.criarProduto(req, res);

      expect(ProdutoService.criarProduto).toHaveBeenCalledWith(
        'Produto B', 'cat1', 100, 'Desc B'
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockResultado.produtoCriado);
    });

    it('deve retornar 400 se campos obrigatórios faltarem', async () => {
      req.body = { nome: 'Incompleto' };

      await ProdutoController.criarProduto(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Todos os campos devem ser preenchidos' });
      expect(ProdutoService.criarProduto).not.toHaveBeenCalled();
    });

    it('deve retornar 400 se tipos de dados inválidos', async () => {
      req.body = {
        nome: 123,
        id_categoria: 'cat1',
        preco: 100,
        descricao: 'Desc'
      };

      await ProdutoController.criarProduto(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringMatching(/Nome deve ser uma string/) }));
    });

    it('deve retornar 400 se serviço retornar falha na criação', async () => {
      req.body = {
        nome: 'Produto B',
        id_categoria: 'cat1',
        preco: 100,
        descricao: 'Desc B'
      };
      ProdutoService.criarProduto.mockResolvedValue(null);

      await ProdutoController.criarProduto(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao criar produto' });
    });

    it('deve retornar 500 em erro de exceção', async () => {
      req.body = {
        nome: 'Produto B',
        id_categoria: 'cat1',
        preco: 100,
        descricao: 'Desc B'
      };
      ProdutoService.criarProduto.mockRejectedValue(new Error('Erro DB'));

      await ProdutoController.criarProduto(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('obterProduto', () => {
    it('deve retornar produto e status 200', async () => {
      req.params = { id: '1' };
      const mockProduto = { _id: '1', nome: 'A' };
      ProdutoService.obterProduto.mockResolvedValue(mockProduto);

      await ProdutoController.obterProduto(req, res);

      expect(ProdutoService.obterProduto).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProduto);
    });

    it('deve retornar 500 se erro', async () => {
      req.params = { id: '1' };
      ProdutoService.obterProduto.mockRejectedValue(new Error('Erro'));

      await ProdutoController.obterProduto(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('atualizarProduto', () => {
    it('deve atualizar e retornar 201', async () => {
      req.params = { id: '1' };
      req.body = {
        nome: 'Novo Nome',
        id_categoria: 'cat1',
        preco: 150,
        descricao: 'Desc Nova'
      };
      const mockAtualizado = { ...req.body, _id: '1' };
      ProdutoService.atualizarProduto.mockResolvedValue(mockAtualizado);

      await ProdutoController.atualizarProduto(req, res);

      expect(ProdutoService.atualizarProduto).toHaveBeenCalledWith('1', req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockAtualizado);
    });

    it('deve retornar 400 se ID não fornecido no params', async () => {
      req.params = {};
      req.body = { nome: 'A', id_categoria: 'c', preco: 1, descricao: 'd' };

      await ProdutoController.atualizarProduto(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('deve retornar 404 se produto não encontrado', async () => {
      req.params = { id: '999' };
      req.body = {
        nome: 'Novo',
        id_categoria: 'cat1',
        preco: 150,
        descricao: 'Desc'
      };
      ProdutoService.atualizarProduto.mockResolvedValue(null);

      await ProdutoController.atualizarProduto(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Produto não encontrado' });
    });
  });

  describe('deletarProduto', () => {
    it('deve deletar e retornar 200', async () => {
      req.params = { id: '1' };
      ProdutoService.deletarProduto.mockResolvedValue(true);

      await ProdutoController.deletarProduto(req, res);

      expect(ProdutoService.deletarProduto).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Produto deletado com sucesso' });
    });

    it('deve retornar 404 se não encontrado', async () => {
      req.params = { id: '999' };
      ProdutoService.deletarProduto.mockResolvedValue(null);

      await ProdutoController.deletarProduto(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Produto não encontrado' });
    });

    it('deve retornar 400 se ID invalido', async () => {
      req.params = {};
      await ProdutoController.deletarProduto(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('obterProdutosPorCategoria', () => {
    it('deve retornar produtos e status 200', async () => {
      req.params = { id_categoria: 'cat1' };
      const mockProdutos = [{ nome: 'ProdCat1' }];
      ProdutoService.obterProdutosPorCategoria.mockResolvedValue(mockProdutos);

      await ProdutoController.obterProdutosPorCategoria(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProdutos);
    });

    it('deve retornar 404 se não encontrar produtos ou categoria', async () => {
      req.params = { id_categoria: 'catVazia' };
      ProdutoService.obterProdutosPorCategoria.mockResolvedValue(null);

      await ProdutoController.obterProdutosPorCategoria(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('deve retornar 400 se id_categoria invalido', async () => {
      req.params = {};
      await ProdutoController.obterProdutosPorCategoria(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

});
