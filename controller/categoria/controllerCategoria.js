/*******************************************************************************************
 * Objetivo: Controlador para gerenciamento de categorias
 * Data: 29/08/2025
 * Autor: Rebeka Marcelino
 * Versão: 1.0
 *******************************************************************************************/
const DACategoria = require('../../model/DAO/categoria/categoria');
const message = require('../../modulo/config');

// Inserir categoria
const inserirCategoria = async (dados, contentType) => {
  try {
    if (contentType.includes('application/json')) {
      if (!dados.nome || dados.nome.length < 3) {
        return message.ERROR_REQUIRED_FIELDS;
      }

      let result = await DACategoria.inserirCategoria(dados);
      return result ? message.SUCESS_CREATED_ITEM : message.ERROR_INTERNAL_SERVER_MODEL;
    }
    return message.ERROR_CONTENT_TYPE;
  } catch (error) {
    console.error(error);
    return message.ERROR_INTERNAL_SERVER_CONTROLLER;
  }
};

// Atualizar categoria
const atualizarCategoria = async (id, dados, contentType) => {
  try {
    if (contentType.includes('application/json')) {
      dados.id = id;

      if (!dados.nome || dados.nome.length < 3) {
        return message.ERROR_REQUIRED_FIELDS;
      }

      let result = await DACategoria.updateCategoria(dados);
      return result ? message.SUCESS_UPDATED_ITEM : message.ERROR_NOT_FOUND;
    }
    return message.ERROR_CONTENT_TYPE;
  } catch (error) {
    console.error(error);
    return message.ERROR_INTERNAL_SERVER_CONTROLLER;
  }
};

// Excluir categoria
const excluirCategoria = async (id) => {
  try {
    let result = await DACategoria.deleteCategoria(id);
    return result ? message.SUCCESS_DELETED_ITEM : message.ERROR_NOT_FOUND;
  } catch (error) {
    console.error(error);
    return message.ERROR_INTERNAL_SERVER_CONTROLLER;
  }
};

// Listar categorias
const listarCategorias = async () => {
  try {
    let result = await DACategoria.selectAllCategorias();
    return result && result.length > 0
      ? { status: true, status_code: 200, categorias: result }
      : message.ERROR_NOT_FOUND;
  } catch (error) {
    console.error(error);
    return message.ERROR_INTERNAL_SERVER_CONTROLLER;
  }
};

// Buscar categoria por ID
const buscarCategoriaPorId = async (id) => {
  try {
    let result = await DACategoria.selectCategoriaById(id);
    return result
      ? { status: true, status_code: 200, categoria: result }
      : message.ERROR_NOT_FOUND;
  } catch (error) {
    console.error(error);
    return message.ERROR_INTERNAL_SERVER_CONTROLLER;
  }
};

module.exports = {
  inserirCategoria,
  atualizarCategoria,
  excluirCategoria,
  listarCategorias,
  buscarCategoriaPorId
};
