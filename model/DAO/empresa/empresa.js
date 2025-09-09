/*************************************************************************************************
 * Objetivo: DAO de Empresas
 * Autor: Rebeka Marcelino
 * Data: 01/09/2025
 * Versão: 1.2
 *************************************************************************************************/

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Inserir empresa
const inserirEmpresa = async (dados) => {
  try {
    const empresa = await prisma.tbl_empresa.create({
      data: {
        nome_empresa: dados.nome_empresa,
        email: dados.email,
        telefone: dados.telefone,
        cpf: dados.cpf,
        cnpj: dados.cnpj,
        logradouro: dados.logradouro,
        numero: dados.numero,
        bairro: dados.bairro,
        cidade: dados.cidade,
        uf: dados.uf,
        cep: dados.cep,
        complemento: dados.complemento || null,
        evento_id: dados.evento_id,
        cupom_id: dados.cupom_id
      }
    });

    return empresa;
  } catch (error) {
    console.error(error);
    return false;
  }
};

// Listar empresas por evento (incluindo participantes)
const listarEmpresasPorEvento = async (eventoId) => {
  try {
    const empresas = await prisma.tbl_empresa.findMany({
      where: { evento_id: parseInt(eventoId) },
      include: {
        tbl_participante: true
      }
    });
    return empresas;
  } catch (error) {
    console.error(error);
    return false;
  }
};

// Buscar empresa por ID
const buscarEmpresaPorId = async (id) => {
  try {
    const empresa = await prisma.tbl_empresa.findUnique({
      where: { id: parseInt(id) },
      include: {
        tbl_participante: true // se quiser já trazer participantes juntos
      }
    });
    return empresa;
  } catch (error) {
    console.error("Erro DAO buscarEmpresaPorId:", error);
    return null;
  }
};

module.exports = {
  inserirEmpresa,
  listarEmpresasPorEvento,
  buscarEmpresaPorId
};
