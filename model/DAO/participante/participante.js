/*******************************************************************************************
 * Objetivo: DAO para gerenciamento de participantes
 *******************************************************************************************/
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const inserirParticipante = async (dados) => {
  try {
    let sql = `
      INSERT INTO tbl_participante (nome, email, telefone, empresa_id)
      VALUES ('${dados.nome}', '${dados.email}', '${dados.telefone}', ${dados.empresa_id})
    `;
    return await prisma.$executeRawUnsafe(sql) ? true : false;
  } catch (error) {
    console.error('Erro ao inserir participante:', error);
    return false;
  }
};

const selectParticipantesByEmpresa = async (empresaId) => {
  try {
    let sql = `SELECT * FROM tbl_participante WHERE empresa_id = ${empresaId}`;
    let result = await prisma.$queryRawUnsafe(sql);
    return result.length > 0 ? result : false;
  } catch (error) {
    console.error('Erro ao listar participantes:', error);
    return false;
  }
};

module.exports = { inserirParticipante, selectParticipantesByEmpresa };
