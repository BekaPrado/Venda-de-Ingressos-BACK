/*******************************************************************************************
 * Objetivo: DAO para gerenciamento de eventos
 * Data: 30/08/2025
 * Autor: Rebeka Marcelino (ajustado)
 * Versão: 1.2 (corrigido para suportar botao_pagseguro com HTML)
 *******************************************************************************************/
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Inserir evento
const inserirEvento = async (dados) => {
  try {
    let sql = `
      INSERT INTO tbl_evento 
        (nome, descricao, valor, foto_url, categoria_id, data_evento, horario_evento, botao_pagseguro, status, limite_participantes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'ativo', ?)
    `;

    const result = await prisma.$executeRawUnsafe(
      sql,
      dados.nome,
      dados.descricao,
      parseFloat(dados.valor),
      dados.foto_url,
      parseInt(dados.categoria_id),
      dados.data_evento,
      dados.horario_evento,
      dados.botao_pagseguro || '',
      parseInt(dados.limite_participantes)
    );

    return result ? true : false;
  } catch (error) {
    console.error('Erro DAO inserirEvento:', error);
    return false;
  }
};

// Atualizar evento
const updateEvento = async (dados) => {
  try {
    let sql = `
      UPDATE tbl_evento SET
        nome = ?,
        descricao = ?,
        valor = ?,
        foto_url = ?,
        categoria_id = ?,
        data_evento = ?,
        horario_evento = ?,
        botao_pagseguro = ?,
        status = ?,
        limite_participantes = ?
      WHERE id = ?
    `;

    const result = await prisma.$executeRawUnsafe(
      sql,
      dados.nome,
      dados.descricao,
      parseFloat(dados.valor),
      dados.foto_url,
      parseInt(dados.categoria_id),
      dados.data_evento,
      dados.horario_evento,
      dados.botao_pagseguro || '',
      dados.status,
      parseInt(dados.limite_participantes),
      parseInt(dados.id)
    );

    return result ? true : false;
  } catch (error) {
    console.error('Erro DAO updateEvento:', error);
    return false;
  }
};

// Cancelar evento
const cancelarEvento = async (id) => {
  try {
    let sql = `UPDATE tbl_evento SET status = 'cancelado' WHERE id = ?`;
    return await prisma.$executeRawUnsafe(sql, parseInt(id)) ? true : false;
  } catch (error) {
    console.error('Erro DAO cancelarEvento:', error);
    return false;
  }
};

// Excluir evento (exclusão lógica)
const deleteEvento = async (id) => {
  try {
    let sql = `UPDATE tbl_evento SET status = 'excluido' WHERE id = ?`;
    return await prisma.$executeRawUnsafe(sql, parseInt(id)) ? true : false;
  } catch (error) {
    console.error('Erro DAO deleteEvento:', error);
    return false;
  }
};

// Buscar todos
const selectAllEventos = async () => {
  try {
    let sql = `SELECT * FROM tbl_evento ORDER BY id DESC`;
    let result = await prisma.$queryRawUnsafe(sql);
    return result.length > 0 ? result : false;
  } catch (error) {
    console.error('Erro DAO selectAllEventos:', error);
    return false;
  }
};

// Buscar por ID
const selectEventoById = async (id) => {
  try {
    let sql = `SELECT * FROM tbl_evento WHERE id = ?`;
    let result = await prisma.$queryRawUnsafe(sql, parseInt(id));
    return result.length > 0 ? result[0] : false;
  } catch (error) {
    console.error('Erro DAO selectEventoById:', error);
    return false;
  }
};

module.exports = {
  inserirEvento,
  updateEvento,
  cancelarEvento,
  deleteEvento,
  selectAllEventos,
  selectEventoById
};
