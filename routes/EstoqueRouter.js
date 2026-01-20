const express = require('express');
const router = express.Router();
const EstoqueController = require('../controller/EstoqueController');

router.get('/', EstoqueController.listarEstoque);
router.get('/:id', EstoqueController.getEstoque);
router.post('/movimentar', EstoqueController.movimentarEstoque);

module.exports = router;