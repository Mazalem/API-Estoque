const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categorias.controller');

router.get('/', categoriasController.listar);

router.post('/', categoriasController.criar);

router.get('/:id', categoriasController.buscarPorId);

router.put('/:id', categoriasController.atualizar);

router.delete('/:id', categoriasController.remover);

module.exports = router;
