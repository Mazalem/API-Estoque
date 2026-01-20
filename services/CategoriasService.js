const Categoria = require("../model/Categoria");

exports.listarCategorias = async () => {
  try {
    return await Categoria.listarCategorias();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.criarCategoria = async (nome) => {
  try {
    const categoria = new Categoria(nome);
    return await Categoria.criarCategoria(categoria);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.buscarCategoriaPorId = async (id_categoria) => {
  try {
    return await Categoria.buscarCategoriaPorId(id_categoria);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.atualizarCategoria = async (id_categoria, categoria) => {
  try {
    const categoriaExiste = await Categoria.buscarCategoriaPorId(id_categoria);
    if (!categoriaExiste) {
      return null;
    }
    const categoriaAtualizada = new Categoria(categoria.nome);
    return await Categoria.atualizarCategoria(id_categoria, categoriaAtualizada);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.removerCategoria = async (id_categoria) => {
  try {
    const categoriaExiste = await Categoria.buscarCategoriaPorId(id_categoria);
    if (!categoriaExiste) {
      return null;
    }
    return await Categoria.removerCategoria(id_categoria);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
