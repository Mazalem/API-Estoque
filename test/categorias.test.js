const categoriasController = require('../controller/CategoriasController');
const categoriasService = require('../services/CategoriasService');

jest.mock('../services/CategoriasService');

describe('CategoriasController Unit Tests', () => {

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

    describe('listarCategorias', () => {
        it('deve retornar status 200 e lista de categorias', async () => {
            const mockCategorias = [{ _id: '1', nome: 'Eletrônicos' }];
            categoriasService.listarCategorias.mockResolvedValue(mockCategorias);

            await categoriasController.listarCategorias(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockCategorias);
            expect(categoriasService.listarCategorias).toHaveBeenCalledTimes(1);
        });

        it('deve retornar status 500 em caso de erro no serviço', async () => {
            const erro = new Error('Erro banco');
            categoriasService.listarCategorias.mockRejectedValue(erro);

            await categoriasController.listarCategorias(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ erro: erro.message });
        });
    });

    describe('criarCategoria', () => {
        it('deve criar categoria e retornar status 201', async () => {
            req.body = { nome: 'Livros' };
            const novaCategoria = { _id: '2', nome: 'Livros' };
            categoriasService.criarCategoria.mockResolvedValue(novaCategoria);

            await categoriasController.criarCategoria(req, res);

            expect(categoriasService.criarCategoria).toHaveBeenCalledWith('Livros');
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(novaCategoria);
        });

        it('deve retornar status 400 se nome não informado', async () => {
            req.body = {};

            await categoriasController.criarCategoria(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ erro: "Campo 'nome' é obrigatório" });
            expect(categoriasService.criarCategoria).not.toHaveBeenCalled();
        });

        it('deve retornar status 500 em caso de erro', async () => {
            req.body = { nome: 'Teste' };
            categoriasService.criarCategoria.mockRejectedValue(new Error('Erro'));

            await categoriasController.criarCategoria(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('buscarCategoriaPorId', () => {
        it('deve retornar categoria e status 200', async () => {
            req.params = { id: '1' };
            const mockCategoria = { _id: '1', nome: 'Teste' };
            categoriasService.buscarCategoriaPorId.mockResolvedValue(mockCategoria);

            await categoriasController.buscarCategoriaPorId(req, res);

            expect(categoriasService.buscarCategoriaPorId).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockCategoria);
        });

        it('deve retornar status 404 se não encontrar', async () => {
            req.params = { id: '999' };
            categoriasService.buscarCategoriaPorId.mockResolvedValue(null);

            await categoriasController.buscarCategoriaPorId(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ mensagem: 'Categoria não encontrada' });
        });

        it('deve retornar status 500 se houver erro', async () => {
            req.params = { id: '1' };
            categoriasService.buscarCategoriaPorId.mockRejectedValue(new Error('Fail'));

            await categoriasController.buscarCategoriaPorId(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('atualizarCategoria', () => {
        it('deve atualizar e retornar status 200', async () => {
            req.params = { id: '1' };
            req.body = { nome: 'Novo Nome' };

            const mockAtualizada = { _id: '1', nome: 'Novo Nome' };
            categoriasService.atualizarCategoria.mockResolvedValue(mockAtualizada);

            await categoriasController.atualizarCategoria(req, res);

            expect(categoriasService.atualizarCategoria).toHaveBeenCalledWith('1', { nome: 'Novo Nome' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockAtualizada);
        });

        it('deve retornar status 400 se nome ou id inválidos', async () => {
            req.params = { id: '1' };
            req.body = {};

            await categoriasController.atualizarCategoria(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ erro: expect.stringMatching(/obrigatórios/) }));
        });

        it('deve retornar status 404 se categoria não encontrada', async () => {
            req.params = { id: '999' };
            req.body = { nome: 'Teste' };
            categoriasService.atualizarCategoria.mockResolvedValue(null);

            await categoriasController.atualizarCategoria(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('removerCategoria', () => {
        it('deve remover e retornar status 200', async () => {
            req.params = { id: '1' };
            categoriasService.removerCategoria.mockResolvedValue(true);

            await categoriasController.removerCategoria(req, res);

            expect(categoriasService.removerCategoria).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Categoria removida com sucesso' });
        });

        it('deve retornar status 404 se não encontrar', async () => {
            req.params = { id: '999' };
            categoriasService.removerCategoria.mockResolvedValue(false);

            await categoriasController.removerCategoria(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('deve retornar status 500 em erro', async () => {
            req.params = { id: '1' };
            categoriasService.removerCategoria.mockRejectedValue(new Error('Erro DB'));

            await categoriasController.removerCategoria(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

});
