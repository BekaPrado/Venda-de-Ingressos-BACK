/*******************************************************************************************
 * Objetivo: DAO para gerenciamento de categorias
 * Data: 29/08/2025
 * Autor: Rebeka Marcelino
 * Versão: 1.0
 *******************************************************************************************/
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Inserir categoria
const inserirCategoria = async (dados) => {
  try {
    let sql = `INSERT INTO tbl_categoria (nome) VALUES ('${dados.nome}')`;
    let result = await prisma.$executeRawUnsafe(sql);

    return result ? true : false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

// Atualizar categoria
const updateCategoria = async (dados) => {
  try {
    let sql = `UPDATE tbl_categoria SET nome = '${dados.nome}' WHERE id = ${dados.id}`;
    let result = await prisma.$executeRawUnsafe(sql);

    return result ? true : false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

// Excluir categoria
const deleteCategoria = async (id) => {
  try {
    let sql = `DELETE FROM tbl_categoria WHERE id = ${id}`;
    let result = await prisma.$executeRawUnsafe(sql);

    return result ? true : false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

// Listar todas as categorias
const selectAllCategorias = async () => {
  try {
    let sql = `SELECT * FROM tbl_categoria ORDER BY id DESC`;
    let rsCategoria = await prisma.$queryRawUnsafe(sql);

    return rsCategoria.length > 0 ? rsCategoria : false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

// Buscar categoria por ID
const selectCategoriaById = async (id) => {
  try {
    let sql = `SELECT * FROM tbl_categoria WHERE id = ${id}`;
    let rsCategoria = await prisma.$queryRawUnsafe(sql);

    return rsCategoria.length > 0 ? rsCategoria[0] : false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

module.exports = {
  inserirCategoria,
  updateCategoria,
  deleteCategoria,
  selectAllCategorias,
  selectCategoriaById
};
