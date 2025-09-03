/*******************************************************************************************
 * Objetivo: Controlador para login do administrador
 *******************************************************************************************/
const DAAdmin = require('../../model/DAO/adminLogin/admin');
const message = require('../../modulo/config');

const verificarCredenciaisAdmin = async (email, senha) => {
  try {
    let result = await DAAdmin.verificarAdmin(email, senha);
    return result ? { status: true, status_code: 200, admin: result } : message.ERROR_NOT_FOUND;
  } catch (error) {
    console.error(error);
    return message.ERROR_INTERNAL_SERVER_CONTROLLER;
  }
};

module.exports = { verificarCredenciaisAdmin };
