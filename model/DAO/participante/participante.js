/*************************************************************************************************
 * Objetivo: DAO de Participantes
 * Autor: Rebeka Marcelino
 * Data: 05/09/2025
 * Versão: 1.1 (atualizado com campos empresa e genero)
 *************************************************************************************************/

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Inserir participante
const inserirParticipante = async (dados) => {
  try {
    const participante = await prisma.tbl_participante.create({
      data: {
        nome: dados.nome,
        email: dados.email,
        telefone: dados.telefone,
        empresa_id: parseInt(dados.empresa_id),
        empresa: dados.empresa || null,
        genero: dados.genero || "Prefiro não informar"
      }
    });
    return participante;
  } catch (error) {
    console.error("Erro DAO inserirParticipante:", error);
    return false;
  }
};

// Listar participantes por empresa
const listarParticipantesPorEmpresa = async (empresaId) => {
  try {
    return await prisma.tbl_participante.findMany({
      where: { empresa_id: parseInt(empresaId) },
      orderBy: { id: 'asc' }
    });
  } catch (error) {
    console.error("Erro DAO listarParticipantesPorEmpresa:", error);
    return []; // em vez de false
  }
};

module.exports = {
  inserirParticipante,
  listarParticipantesPorEmpresa
};
