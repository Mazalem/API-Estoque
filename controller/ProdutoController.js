const Produto = require("../model/Produto");

exports.listarProdutos = async (req, res) => {
    const produtos = await Produto.listarProdutos();
    res.status(200).json(produtos);
}; 

exports.criarProduto = async (req, res) => {
    const produto = await Produto.criarProduto(req.body);
    res.status(201).json(produto);
};

exports.obterProduto = async (req, res) => {
    const produto = await Produto.obterProduto(req.params.id);
    res.status(200).json(produto);
};

exports.atualizarProduto = async (req, res) => {
    const produto = await Produto.atualizarProduto(req.params.id, req.body);
    res.status(201).json(produto);
};

exports.deletarProduto = async (req, res) => {
    await Produto.deletarProduto(req.params.id);
    res.status(204).end();
};