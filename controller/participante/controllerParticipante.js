/*******************************************************************************************
 * Objetivo: Controlador para gerenciamento de participantes
 *******************************************************************************************/
const DAParticipante = require('../../model/DAO/participante/participante');
const message = require('../../modulo/config');

const inserirParticipante = async (dados, contentType) => {
  try {
    if (contentType.includes('application/json')) {
      if (!dados.nome || !dados.email || !dados.telefone || !dados.empresa_id) {
        return message.ERROR_REQUIRED_FIELDS;
      }
      let result = await DAParticipante.inserirParticipante(dados);
      return result ? message.SUCESS_CREATED_ITEM : message.ERROR_INTERNAL_SERVER_MODEL;
    }
    return message.ERROR_CONTENT_TYPE;
  } catch (error) {
    console.error(error);
    return message.ERROR_INTERNAL_SERVER_CONTROLLER;
  }
};

const listarParticipantesPorEmpresa = async (empresaId) => {
  try {
    let result = await DAParticipante.selectParticipantesByEmpresa(empresaId);
    return result ? { status: true, status_code: 200, participantes: result } : message.ERROR_NOT_FOUND;
  } catch (error) {
    console.error(error);
    return message.ERROR_INTERNAL_SERVER_CONTROLLER;
  }
};

module.exports = { inserirParticipante, listarParticipantesPorEmpresa };
