/*************************************************************************************************
 * Objetivo: DAO de Empresas
 * Autor: Rebeka Marcelino
 * Data: 01/09/2025
 * Versão: 1.0
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
                telefone: dados.telefone || null,
                cpf: dados.cpf || null,
                cnpj: dados.cnpj || null,
                endereco: dados.endereco || null,
                evento_id: parseInt(dados.evento_id),
                cupom_id: dados.cupom_id ? parseInt(dados.cupom_id) : null
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
                tbl_participante: true // 🔥 já traz os participantes
            }
        });
        return empresas;
    } catch (error) {
        console.error(error);
        return false;
    }
};

module.exports = {
    inserirEmpresa,
    listarEmpresasPorEvento
};
