/*******************************************************************************************
 * Objetivo: Controlador para gerenciamento de cupons (sem tipo e validade)
 *******************************************************************************************/
const DACupom = require('../../model/DAO/cupom/cupom');
const message = require('../../modulo/config');

const inserirCupom = async (dados, contentType) => {
  try {
    if (contentType.includes('application/json')) {
      if (!dados.codigo || !dados.desconto || !dados.evento_id || !dados.botao_pagseguro_html) {
        return message.ERROR_REQUIRED_FIELDS;
      }

      let result = await DACupom.inserirCupom(dados);
      return result ? message.SUCESS_CREATED_ITEM : message.ERROR_INTERNAL_SERVER_MODEL;
    }
    return message.ERROR_CONTENT_TYPE;
  } catch (error) {
    console.error(error);
    return message.ERROR_INTERNAL_SERVER_CONTROLLER;
  }
};

const listarCuponsPorEvento = async (eventoId) => {
  try {
    let result = await DACupom.selectCuponsByEvento(eventoId);
    return result ? { status: true, status_code: 200, cupons: result } : message.ERROR_NOT_FOUND;
  } catch (error) {
    console.error(error);
    return message.ERROR_INTERNAL_SERVER_CONTROLLER;
  }
};

const validarCupom = async (dados, contentType) => {
  try {
    if (contentType.includes('application/json')) {
      let result = await DACupom.validarCupom(dados.codigo, dados.evento_id);
      return result ? { status: true, status_code: 200, cupom: result } : message.ERROR_NOT_FOUND;
    }
    return message.ERROR_CONTENT_TYPE;
  } catch (error) {
    console.error(error);
    return message.ERROR_INTERNAL_SERVER_CONTROLLER;
  }
};

const atualizarCupom = async (id, dados, contentType) => {
  try {
    if (contentType.includes('application/json')) {
      if (!dados.codigo || !dados.desconto || !dados.evento_id || !dados.botao_pagseguro_html) {
        return message.ERROR_REQUIRED_FIELDS;
      }

      let result = await DACupom.atualizarCupom(id, dados);
      return result ? message.SUCESS_UPDATED_ITEM : message.ERROR_NOT_FOUND;
    }
    return message.ERROR_CONTENT_TYPE;
  } catch (error) {
    console.error(error);
    return message.ERROR_INTERNAL_SERVER_CONTROLLER;
  }
};

const deletarCupom = async (id) => {
  try {
    const result = await DACupom.deletarCupom(id);
    return result;
  } catch (error) {
    console.error(error);
    return message.ERROR_INTERNAL_SERVER_CONTROLLER;
  }
};

module.exports = {
  inserirCupom,
  listarCuponsPorEvento,
  validarCupom,
  atualizarCupom,
  deletarCupom
};
