const Categoria = require("../../model/Categoria");

const listar = async () => {
  return await Categoria.listar();
};

const criar = async (categoria) => {
  return await Categoria.criar(categoria);
};

const buscarPorId = async (id) => {
  return await Categoria.buscarPorId(id);
};

const atualizar = async (id, dadosAtualizados) => {
  return await Categoria.atualizar(id, dadosAtualizados);
};

const remover = async (id) => {
  return await Categoria.remover(id);
};

module.exports = {
  listar,
  criar,
  buscarPorId,
  atualizar,
  remover
};
