const EstoqueController = require('../controller/EstoqueController');
const EstoqueService = require('../services/EstoqueService');

jest.mock('../services/EstoqueService');

describe('EstoqueController Unit Tests', () => {
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

    describe('listarEstoque', () => {
        it('deve retornar lista de estoques e status 200', async () => {
            const mockEstoques = [{ _id: '1', quantidade: 10 }];
            EstoqueService.listarEstoques.mockResolvedValue(mockEstoques);

            await EstoqueController.listarEstoque(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockEstoques);
            expect(EstoqueService.listarEstoques).toHaveBeenCalledTimes(1);
        });

        it('deve retornar status 500 em caso de erro', async () => {
            EstoqueService.listarEstoques.mockRejectedValue(new Error('Erro'));

            await EstoqueController.listarEstoque(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Erro ao listar estoques" });
        });
    });

    describe('getEstoque', () => {
        it('deve retornar estoque e status 200', async () => {
            req.params = { id: 'prod1' };
            const mockEstoque = { _id: 'est1', id_produto: 'prod1', quantidade: 5 };
            EstoqueService.getEstoqueByProduto.mockResolvedValue(mockEstoque);

            await EstoqueController.getEstoque(req, res);

            expect(EstoqueService.getEstoqueByProduto).toHaveBeenCalledWith('prod1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockEstoque);
        });

        it('deve retornar 400 se ID não informado', async () => {
            req.params = {};

            await EstoqueController.getEstoque(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Dados inválidos" });
            expect(EstoqueService.getEstoqueByProduto).not.toHaveBeenCalled();
        });

        it('deve retornar 500 em caso de erro', async () => {
            req.params = { id: 'prod1' };
            EstoqueService.getEstoqueByProduto.mockRejectedValue(new Error('Erro'));

            await EstoqueController.getEstoque(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Erro ao buscar estoque" });
        });
    });

    describe('movimentarEstoque', () => {
        it('deve realizar entrada com sucesso (200)', async () => {
            req.body = {
                id_produto: 'prod1',
                quantidade: 10,
                tipo: 'entrada'
            };
            const mockEstoqueAtualizado = { _id: 'est1', quantidade: 20 };
            EstoqueService.movimentarEstoque.mockResolvedValue(mockEstoqueAtualizado);

            await EstoqueController.movimentarEstoque(req, res);

            expect(EstoqueService.movimentarEstoque).toHaveBeenCalledWith('prod1', 10, 'entrada');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockEstoqueAtualizado);
        });

        it('deve realizar saida com sucesso (200)', async () => {
            req.body = {
                id_produto: 'prod1',
                quantidade: 5,
                tipo: 'saida'
            };
            const mockEstoqueAtualizado = { _id: 'est1', quantidade: 5 };
            EstoqueService.movimentarEstoque.mockResolvedValue(mockEstoqueAtualizado);

            await EstoqueController.movimentarEstoque(req, res);

            expect(EstoqueService.movimentarEstoque).toHaveBeenCalledWith('prod1', 5, 'saida');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockEstoqueAtualizado);
        });

        it('deve retornar 400 se dados inválidos (faltando campos)', async () => {
            req.body = { id_produto: 'prod1', tipo: 'entrada' };

            await EstoqueController.movimentarEstoque(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Dados inválidos" });
        });

        it('deve retornar 400 se tipo de movimentação inválido', async () => {
            req.body = {
                id_produto: 'prod1',
                quantidade: 10,
                tipo: 'invalido'
            };

            await EstoqueController.movimentarEstoque(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Tipo inválido" });
        });

        it('deve retornar 400 se quantidade inválida (não número)', async () => {
            req.body = {
                id_produto: 'prod1',
                quantidade: 'dez',
                tipo: 'entrada'
            };

            await EstoqueController.movimentarEstoque(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Quantidade inválida" });
        });

        it('deve retornar 404 se estoque não encontrado (ou saldo insuficiente)', async () => {
            req.body = {
                id_produto: 'prod1',
                quantidade: 10,
                tipo: 'saida'
            };
            EstoqueService.movimentarEstoque.mockResolvedValue(null);

            await EstoqueController.movimentarEstoque(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Estoque não encontrado" });
        });

        it('deve retornar 500 em caso de erro', async () => {
            req.body = {
                id_produto: 'prod1',
                quantidade: 10,
                tipo: 'entrada'
            };
            EstoqueService.movimentarEstoque.mockRejectedValue(new Error('Erro'));

            await EstoqueController.movimentarEstoque(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Erro ao movimentar estoque" });
        });
    });
});
