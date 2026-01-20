const express = require('express');
const router = express.Router();
const categoriasController = require('../controller/CategoriasController');

router.get('/', categoriasController.listarCategorias);
router.post('/', categoriasController.criarCategoria);
router.get('/:id', categoriasController.buscarCategoriaPorId);
router.put('/:id', categoriasController.atualizarCategoria);
router.delete('/:id', categoriasController.removerCategoria);

module.exports = router;
