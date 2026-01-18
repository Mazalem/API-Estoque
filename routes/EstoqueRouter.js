let express = require('express');
let router = express.Router();
let EstoqueController = require('../controller/EstoqueController');

router.get('/', EstoqueController.listarEstoque);
router.get('/:id', EstoqueController.getEstoque);
router.post('/movimentar', EstoqueController.movimentarEstoque);
router.delete('/:id', EstoqueController.deletarEstoque);

module.exports = router;