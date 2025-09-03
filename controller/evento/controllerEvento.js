/*******************************************************************************************
 * Objetivo: Controlador para gerenciamento de eventos
 * Data: 01/09/2025
 * Autor: Rebeka Marcelino (ajustado)
 * Versão: 1.2 (corrigido para suportar botao_pagseguro com HTML)
 *******************************************************************************************/
const DAEvento = require('../../model/DAO/evento/evento');
const message = require('../../modulo/config');

// Inserir evento
const inserirEvento = async (dados, contentType) => {
  try {
    if (contentType.includes('application/json')) {
      if (
        !dados.nome ||
        !dados.descricao ||
        !dados.valor ||
        !dados.categoria_id ||
        !dados.data_evento ||
        !dados.horario_evento ||
        !dados.limite_participantes ||
        !dados.botao_pagseguro // 🔹 agora é obrigatório como no cupom
      ) {
        return message.ERROR_REQUIRED_FIELDS;
      }

      let result = await DAEvento.inserirEvento(dados);
      return result ? message.SUCESS_CREATED_ITEM : message.ERROR_INTERNAL_SERVER_MODEL;
    }
    return message.ERROR_CONTENT_TYPE;
  } catch (error) {
    console.error('Erro controller inserirEvento:', error);
    return message.ERROR_INTERNAL_SERVER_CONTROLLER;
  }
};

// Atualizar evento
const atualizarEvento = async (id, dados, contentType) => {
  try {
    if (contentType.includes('application/json')) {
      if (
        !dados.nome ||
        !dados.descricao ||
        !dados.valor ||
        !dados.categoria_id ||
        !dados.data_evento ||
        !dados.horario_evento ||
        !dados.limite_participantes ||
        !dados.botao_pagseguro
      ) {
        return message.ERROR_REQUIRED_FIELDS;
      }

      dados.id = id;
      let result = await DAEvento.updateEvento(dados);
      return result ? message.SUCESS_UPDATED_ITEM : message.ERROR_NOT_FOUND;
    }
    return message.ERROR_CONTENT_TYPE;
  } catch (error) {
    console.error('Erro controller atualizarEvento:', error);
    return message.ERROR_INTERNAL_SERVER_CONTROLLER;
  }
};

// Cancelar evento
const cancelarEvento = async (id) => {
  try {
    let result = await DAEvento.cancelarEvento(id);
    return result ? message.SUCESS_UPDATED_ITEM : message.ERROR_NOT_FOUND;
  } catch (error) {
    console.error('Erro controller cancelarEvento:', error);
    return message.ERROR_INTERNAL_SERVER_CONTROLLER;
  }
};

// Excluir evento
const excluirEvento = async (id) => {
  try {
    let result = await DAEvento.deleteEvento(id);
    return result ? message.SUCCESS_DELETED_ITEM : message.ERROR_NOT_FOUND;
  } catch (error) {
    console.error('Erro controller excluirEvento:', error);
    return message.ERROR_INTERNAL_SERVER_CONTROLLER;
  }
};

// Listar eventos
const listarEventos = async () => {
  try {
    let result = await DAEvento.selectAllEventos();
    return result ? { status: true, status_code: 200, eventos: result } : message.ERROR_NOT_FOUND;
  } catch (error) {
    console.error('Erro controller listarEventos:', error);
    return message.ERROR_INTERNAL_SERVER_CONTROLLER;
  }
};

// Buscar evento por ID
const buscarEventoPorId = async (id) => {
  try {
    let result = await DAEvento.selectEventoById(id);
    return result ? { status: true, status_code: 200, evento: result } : message.ERROR_NOT_FOUND;
  } catch (error) {
    console.error('Erro controller buscarEventoPorId:', error);
    return message.ERROR_INTERNAL_SERVER_CONTROLLER;
  }
};

module.exports = {
  inserirEvento,
  atualizarEvento,
  cancelarEvento,
  excluirEvento,
  listarEventos,
  buscarEventoPorId
};
