/*******************************************************************************************
 * Objetivo: DAO para gerenciamento de cupons
 *******************************************************************************************/
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const inserirCupom = async (dados) => {
  try {
    let sql = `
      INSERT INTO tbl_cupom 
        (codigo, descricao, desconto, tipo, evento_id, valido_ate, botao_pagseguro_html)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await prisma.$executeRawUnsafe(
      sql,
      dados.codigo,
      dados.descricao || '',
      parseFloat(dados.desconto),
      dados.tipo,
      parseInt(dados.evento_id),
      dados.valido_ate || null,
      dados.botao_pagseguro_html
    );

    return result ? true : false;
  } catch (error) {
    console.error('Erro ao inserir cupom:', error);
    return false;
  }
};

const selectCuponsByEvento = async (eventoId) => {
  try {
    let sql = `SELECT * FROM tbl_cupom WHERE evento_id = ?`;
    let result = await prisma.$queryRawUnsafe(sql, parseInt(eventoId));
    return result.length > 0 ? result : false;
  } catch (error) {
    console.error('Erro ao listar cupons:', error);
    return false;
  }
};

const validarCupom = async (codigo, eventoId) => {
  try {
    let sql = `SELECT * FROM tbl_cupom WHERE codigo = ? AND evento_id = ?`;
    let result = await prisma.$queryRawUnsafe(sql, codigo, parseInt(eventoId));
    return result.length > 0 ? result[0] : false;
  } catch (error) {
    console.error('Erro ao validar cupom:', error);
    return false;
  }
};

const atualizarCupom = async (id, dados) => {
  try {
    let sql = `
      UPDATE tbl_cupom 
      SET codigo = ?, descricao = ?, desconto = ?, tipo = ?, evento_id = ?, valido_ate = ?, botao_pagseguro_html = ?
      WHERE id = ?
    `;

    const result = await prisma.$executeRawUnsafe(
      sql,
      dados.codigo,
      dados.descricao || '',
      parseFloat(dados.desconto),
      dados.tipo,
      parseInt(dados.evento_id),
      dados.valido_ate || null,
      dados.botao_pagseguro_html,
      parseInt(id)
    );

    return result ? true : false;
  } catch (error) {
    console.error('Erro ao atualizar cupom:', error);
    return false;
  }
};

const deletarCupom = async (id) => {
  try {
    let sql = `DELETE FROM tbl_cupom WHERE id = ?`;
    const result = await prisma.$executeRawUnsafe(sql, parseInt(id));
    return result ? { status: true, status_code: 200 } : { status: false, status_code: 404, message: "Cupom não encontrado." };
  } catch (error) {
    if (error.code === 'P2010' && error.meta?.code === '1451') {
      // cupom em uso
      return { status: false, status_code: 409, message: "Cupom em uso por uma empresa. Não pode ser excluído." };
    }
    console.error('Erro ao deletar cupom:', error);
    return { status: false, status_code: 500, message: "Erro interno ao excluir cupom." };
  }
};

module.exports = {
  inserirCupom,
  selectCuponsByEvento,
  validarCupom,
  atualizarCupom,
  deletarCupom
};
