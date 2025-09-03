/*******************************************************************************************
 * Objetivo: DAO para login de administrador
 *******************************************************************************************/
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const verificarAdmin = async (email, senha) => {
  try {
    let sql = `SELECT * FROM tbl_admin_login WHERE email = '${email}' AND senha = '${senha}'`;
    let result = await prisma.$queryRawUnsafe(sql);
    return result.length > 0 ? result[0] : false;
  } catch (error) {
    console.error('Erro ao verificar admin:', error);
    return false;
  }
};

module.exports = { verificarAdmin };
