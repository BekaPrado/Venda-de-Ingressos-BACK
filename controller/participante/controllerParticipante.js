/*************************************************************************************************
 * Objetivo: Controller de Participantes
 * Autor: Rebeka Marcelino
 * Data: 04/09/2025
 * Versão: 1.1 (com validação de mínimo e duplicados)
 *************************************************************************************************/

const participanteDAO = require('../../model/DAO/participante/participante');
const empresaDAO = require('../../model/DAO/empresa/empresa');
const eventoDAO = require('../../model/DAO/evento/evento');
const config = require('../../modulo/config');

// Criar participante
const inserirParticipante = async (dados, contentType) => {
  try {
    if (String(contentType).toLowerCase() !== 'application/json') {
      return config.ERROR_CONTENT_TYPE;
    }

    if (!dados.nome || !dados.email || !dados.telefone || !dados.empresa_id) {
      return config.ERROR_REQUIRED_FIELDS;
    }

    // Buscar empresa vinculada
    const empresa = await empresaDAO.buscarEmpresaPorId(dados.empresa_id);
    if (!empresa) {
      return {
        status: false,
        status_code: 404,
        message: "Empresa não encontrada."
      };
    }

    // Buscar evento para checar limite de participantes
    const evento = await eventoDAO.buscarEventoPorId(empresa.evento_id);
    if (!evento) {
      return {
        status: false,
        status_code: 404,
        message: "Evento não encontrado."
      };
    }

    // Buscar participantes existentes dessa empresa
    const existentes = await participanteDAO.listarParticipantesPorEmpresa(dados.empresa_id);

    // Verifica duplicados (nome, email ou telefone iguais)
    const repetido = existentes.find(p =>
  p.nome.toLowerCase() === dados.nome.toLowerCase() &&
  (p.email && dados.email && p.email.toLowerCase() === dados.email.toLowerCase()) &&
  (p.telefone && dados.telefone && p.telefone === dados.telefone)
);

    if (repetido) {
      return {
        status: false,
        status_code: 400,
        message: "Já existe um participante com o mesmo nome, email ou telefone nesta empresa."
      };
    }

    // Se já atingiu o limite de participantes do evento
    if (existentes.length >= evento.limite_participantes) {
      return {
        status: false,
        status_code: 400,
        message: `O limite de ${evento.limite_participantes} participantes já foi atingido para este evento.`
      };
    }

    // Inserir participante
    const participante = await participanteDAO.inserirParticipante(dados);

    if (participante) {
      return {
        status: true,
        status_code: 201,
        message: "Participante cadastrado com sucesso!",
        participante
      };
    } else {
      return config.ERROR_INTERNAL_SERVER_CONTROLLER;
    }

  } catch (error) {
    console.error(error);
    return config.ERROR_INTERNAL_SERVER_CONTROLLER;
  }
};

// Listar participantes por empresa
const listarParticipantesPorEmpresa = async (empresaId) => {
  try {
    const participantes = await participanteDAO.listarParticipantesPorEmpresa(empresaId);

    if (!participantes) { // se DAO retornou null (não deveria mais)
      return config.ERROR_INTERNAL_SERVER_CONTROLLER;
    }

    if (participantes.length > 0) {
      return { status: true, status_code: 200, participantes };
    } else {
      return { status: true, status_code: 200, participantes: [] }; 
      // em vez de ERROR_NOT_FOUND → front lida melhor
    }
  } catch (error) {
    console.error(error);
    return config.ERROR_INTERNAL_SERVER_CONTROLLER;
  }
};


module.exports = {
  inserirParticipante,
  listarParticipantesPorEmpresa
};
