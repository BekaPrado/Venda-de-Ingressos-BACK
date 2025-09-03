/*************************************************************************************************
 * Objetivo: Controller de Empresas
 * Autor: Rebeka Marcelino
 * Data: 01/09/2025
 * Versão: 1.0
 *************************************************************************************************/

const empresaDAO = require('../../model/DAO/empresa/empresa');
const config = require('../../modulo/config');

// Criar nova empresa
const inserirEmpresa = async (dados, contentType) => {
    try {
        if (String(contentType).toLowerCase() !== 'application/json') {
            return config.ERROR_CONTENT_TYPE;
        }

        if (!dados.nome_empresa || !dados.email || !dados.evento_id) {
            return config.ERROR_REQUIRED_FIELDS;
        }

        const novaEmpresa = await empresaDAO.inserirEmpresa(dados);

        if (novaEmpresa) {
            return {
                status: true,
                status_code: 201,
                message: "Empresa cadastrada com sucesso!",
                empresa: novaEmpresa
            };
        } else {
            return config.ERROR_INTERNAL_SERVER_CONTROLLER;
        }
    } catch (error) {
        console.error(error);
        return config.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
};

// Listar empresas de um evento (com participantes)
const listarEmpresasPorEvento = async (eventoId) => {
    try {
        const empresas = await empresaDAO.listarEmpresasPorEvento(eventoId);

        if (empresas && empresas.length > 0) {
            return {
                status: true,
                status_code: 200,
                empresas: empresas
            };
        } else {
            return config.ERROR_NOT_FOUND;
        }
    } catch (error) {
        console.error(error);
        return config.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
};

module.exports = {
    inserirEmpresa,
    listarEmpresasPorEvento
};
