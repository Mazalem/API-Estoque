let express = require('express');
let router = express.Router();
let ProdutoController = require('../controller/ProdutoController');

router.get('/', ProdutoController.listarProdutos);
router.post('/', ProdutoController.criarProduto);
router.get('/:id', ProdutoController.obterProduto);
router.put('/:id', ProdutoController.atualizarProduto);
router.delete('/:id', ProdutoController.deletarProduto);

module.exports = router;