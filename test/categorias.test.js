const request = require('supertest');
const app = require('../src/app');

describe('Categorias API', () => {
    let novaCategoriaId;

    it('GET /categorias - Deve listar categorias', async () => {
        const res = await request(app).get('/categorias');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        if (res.body.length > 0) {
            expect(res.body[0]).toHaveProperty('_id');
            expect(res.body[0]).toHaveProperty('nome');
        }
    });

    it('POST /categorias - Deve criar uma categoria', async () => {
        const novaCategoria = {
            nome: "Eletrônicos"
        };
        const res = await request(app).post('/categorias').send(novaCategoria);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.nome).toEqual(novaCategoria.nome);
        novaCategoriaId = res.body._id;
    });

    it('POST /categorias - Deve retornar erro 400 se nome estiver ausente', async () => {
        const res = await request(app).post('/categorias').send({});
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('erro');
    });

    it('GET /categorias/:id - Deve buscar categoria por id', async () => {
        if (!novaCategoriaId) return;
        const res = await request(app).get(`/categorias/${novaCategoriaId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body._id).toEqual(novaCategoriaId);
        expect(res.body.nome).toEqual("Eletrônicos");
    });

    it('GET /categorias/:id - Deve retornar 404 para categoria inexistente', async () => {
        const fakeId = "693afda0f6437add7f9646c9";
        const res = await request(app).get(`/categorias/${fakeId}`);
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('mensagem');
    });

    it('PUT /categorias/:id - Deve atualizar categoria', async () => {
        if (!novaCategoriaId) return;
        const atualizacao = { nome: "Eletrônicos & Gadgets" };
        const res = await request(app).put(`/categorias/${novaCategoriaId}`).send(atualizacao);
        expect(res.statusCode).toEqual(200);
        expect(res.body.nome).toEqual(atualizacao.nome);
    });

    it('PUT /categorias/:id - Deve retornar 404 para atualização de categoria inexistente', async () => {
        const fakeId = "693afda0f6437add7f9646c9";
        const res = await request(app).put(`/categorias/${fakeId}`).send({ nome: "Nada" });
        expect(res.statusCode).toEqual(404);
    });

    it('PUT /categorias/:id - Deve retornar 400 se nome ausente na atualização', async () => {
        if (!novaCategoriaId) return;
        const res = await request(app).put(`/categorias/${novaCategoriaId}`).send({});
        expect(res.statusCode).toEqual(400);
    });

    it('DELETE /categorias/:id - Deve remover categoria', async () => {
        if (!novaCategoriaId) return;
        const res = await request(app).delete(`/categorias/${novaCategoriaId}`);
        expect(res.statusCode).toEqual(204);
    });

    it('DELETE /categorias/:id - Deve retornar 404 para remoção de categoria inexistente', async () => {
        const fakeId = "693afda0f6437add7f9646c9";
        const res = await request(app).delete(`/categorias/${fakeId}`);
        expect(res.statusCode).toEqual(404);
    });
});
