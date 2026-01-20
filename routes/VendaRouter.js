const express = require('express');
const router = express.Router();
const VendaController = require('../controller/VendaController');

router.get('/', VendaController.listarVendas);
router.post('/', VendaController.criarVenda);
router.get('/:id', VendaController.obterVenda);
router.put('/:id', VendaController.atualizarVenda);
router.delete('/:id', VendaController.deletarVenda);

module.exports = router;