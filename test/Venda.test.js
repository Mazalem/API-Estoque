const VendaController = require('../controller/VendaController');
const VendaService = require('../services/VendasService');

jest.mock('../services/VendasService');

describe('VendaController Unit Tests', () => {
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

    describe('listarVendas', () => {
        it('deve retornar lista de vendas e status 200', async () => {
            const mockVendas = [{ _id: '1', total: 100 }];
            VendaService.listarVendas.mockResolvedValue(mockVendas);

            await VendaController.listarVendas(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockVendas);
            expect(VendaService.listarVendas).toHaveBeenCalledTimes(1);
        });

        it('deve retornar 404 se não houver vendas (retorno null/service)', async () => {
            VendaService.listarVendas.mockResolvedValue(null);

            await VendaController.listarVendas(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Vendas não encontradas" });
        });

        it('deve retornar 500 em erro', async () => {
            VendaService.listarVendas.mockRejectedValue(new Error('Erro'));

            await VendaController.listarVendas(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('criarVenda', () => {
        const itensValidos = [
            { id_produto: 'p1', quantidade: 2 }
        ];

        it('deve criar venda e retornar 201', async () => {
            req.body = { itens: itensValidos };
            const mockVendaCriada = { _id: 'v1', total: 200, itens: itensValidos };
            VendaService.criarVenda.mockResolvedValue(mockVendaCriada);

            await VendaController.criarVenda(req, res);

            expect(VendaService.criarVenda).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockVendaCriada);
        });

        it('deve retornar 400 se itens não fornecidos', async () => {
            req.body = {};

            await VendaController.criarVenda(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Itens não fornecidos" });
            expect(VendaService.criarVenda).not.toHaveBeenCalled();
        });

        it('deve retornar 400 se item inválido (falta id ou qtd)', async () => {
            req.body = { itens: [{ quantidade: 2 }] };

            await VendaController.criarVenda(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Item inválido" });
        });

        it('deve retornar 400 se tipo de dados inválido no item', async () => {
            req.body = { itens: [{ id_produto: 123, quantidade: 2 }] };

            await VendaController.criarVenda(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Item inválido" });
        });

        it('deve retornar 400 se quantidade <= 0', async () => {
            req.body = { itens: [{ id_produto: 'p1', quantidade: -1 }] };

            await VendaController.criarVenda(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Quantidade inválida" });
        });

        it('deve retornar 400 se service falhar (produto não existe/sem estoque)', async () => {
            req.body = { itens: itensValidos };
            VendaService.criarVenda.mockResolvedValue(null);

            await VendaController.criarVenda(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Erro ao criar venda" });
        });

        it('deve retornar 500 em erro', async () => {
            req.body = { itens: itensValidos };
            VendaService.criarVenda.mockRejectedValue(new Error('Erro'));

            await VendaController.criarVenda(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('obterVenda', () => {
        it('deve retornar venda e 200', async () => {
            req.params = { id: 'v1' };
            const mockVenda = { _id: 'v1', total: 100 };
            VendaService.obterVenda.mockResolvedValue(mockVenda);

            await VendaController.obterVenda(req, res);

            expect(VendaService.obterVenda).toHaveBeenCalledWith('v1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockVenda);
        });

        it('deve retornar 400 se ID não fornecido', async () => {
            req.params = {};

            await VendaController.obterVenda(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "ID não fornecido" });
        });

        it('deve retornar 404 se não encontrada', async () => {
            req.params = { id: 'v99' };
            VendaService.obterVenda.mockResolvedValue(null);

            await VendaController.obterVenda(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Venda não encontrada" });
        });

        it('deve retornar 500 em erro', async () => {
            req.params = { id: 'v1' };
            VendaService.obterVenda.mockRejectedValue(new Error('Erro'));

            await VendaController.obterVenda(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('atualizarVenda', () => {
        const itensValidos = [{ id_produto: 'p1', quantidade: 5 }];

        it('deve atualizar e retornar 200', async () => {
            req.params = { id: 'v1' };
            req.body = { itens: itensValidos };

            const mockVendaAtualizada = { _id: 'v1', itens: itensValidos };
            VendaService.atualizarVenda.mockResolvedValue(mockVendaAtualizada);

            await VendaController.atualizarVenda(req, res);

            expect(VendaService.atualizarVenda).toHaveBeenCalledWith('v1', itensValidos);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockVendaAtualizada);
        });

        it('deve retornar 400 se ID não informado', async () => {
            req.params = {};
            await VendaController.atualizarVenda(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "ID não fornecido" });
        });

        it('deve retornar 400 se itens não informados', async () => {
            req.params = { id: 'v1' };
            req.body = {};
            await VendaController.atualizarVenda(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Itens não fornecidos" });
        });

        it('deve retornar 400 se item inválido na atualização', async () => {
            req.params = { id: 'v1' };
            req.body = { itens: [{ quantidade: 1 }] }
            await VendaController.atualizarVenda(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Item inválido" });
        });

        it('deve retornar 404 se venda não encontrada (service retorna null)', async () => {
            req.params = { id: 'v99' };
            req.body = { itens: itensValidos };
            VendaService.atualizarVenda.mockResolvedValue(null);

            await VendaController.atualizarVenda(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Venda não encontrada" });
        });

        it('deve retornar 500 em erro', async () => {
            req.params = { id: 'v1' };
            req.body = { itens: itensValidos };
            VendaService.atualizarVenda.mockRejectedValue(new Error('Erro'));

            await VendaController.atualizarVenda(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('deletarVenda', () => {
        it('deve deletar e retornar 200', async () => {
            req.params = { id: 'v1' };
            VendaService.deletarVenda.mockResolvedValue(true);

            await VendaController.deletarVenda(req, res);

            expect(VendaService.deletarVenda).toHaveBeenCalledWith('v1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "Venda deletada com sucesso" });
        });

        it('deve retornar 400 se ID não informado', async () => {
            req.params = {};
            await VendaController.deletarVenda(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "ID não fornecido" });
        });

        it('deve retornar 404 se venda não encontrada', async () => {
            req.params = { id: 'v99' };
            VendaService.deletarVenda.mockResolvedValue(false);

            await VendaController.deletarVenda(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Venda não encontrada" });
        });

        it('deve retornar 500 em erro', async () => {
            req.params = { id: 'v1' };
            VendaService.deletarVenda.mockRejectedValue(new Error('Erro'));

            await VendaController.deletarVenda(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

});
