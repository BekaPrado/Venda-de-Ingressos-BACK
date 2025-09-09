/******************************************************************************************************
 * OBJETIVO: Criar uma API para realizar o CRUD de Clientes.
 * DATA: 29/08/2025
 * AUTOR: Rebeka Marcelino do Prado
 * Versão: 1.0
 * Observação:                                                                                        *
 *         Para criar a API precisamos instalar:                                                     *
 *                 express             npm install express --save                                     *
 *                 cors                npm install cors --save                                        *
 *                 body-parser         npm install body-parser --save                                 *
 *                                                                                                    *
 *          Para criar a integração com o Banco de Dados precisamos instalar:                         *
 *                 prisma               npm install prisma --save(para fazer a conexão com o BD)       *
 *                 prisma/client        npm install @prisma/client --save (para rodar os scripts SQL) *
 *                                                                                                    *  
 *                                                                                                    *
 *          Após a instalação do prima e do prisma client, devemos :                                  *
 *              npx prisma init                                     
 *                  
 *                                                                                                    *
 *          Você deverá configurar o arquivo .env e o schema.prisma com as credenciais do BD          *
 *          Após essa configuração voce deverá rodar o seguinte comando:                              *
 *                      npx prisma migrate dev   
 *
 *          Instalar o NodeMailer para mandar os emails
 * 
 *          npm install nodemailer
 * 
 *          npm install dotenv 
 *********************************************************************************************************/

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const bodyParserJSON = bodyParser.json();
const app = express();

const ExcelJS = require('exceljs');


app.use(cors());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(express.json());

/************************************
 *         ADMIN LOGIN
 ************************************/
const controllerAdmin = require('./controller/adminLogin/adminLoginController');
app.post('/v1/100open/admin/login', cors(), bodyParserJSON, async (req, res) => {
    const { email, senha } = req.body;
    const result = await controllerAdmin.verificarCredenciaisAdmin(email, senha);
    res.status(result.status_code).json(result);
});


/************************************
 *            CATEGORIA
 ************************************/
const controllerCategoria = require('./controller/categoria/controllerCategoria');
app.post('/v1/100open/categoria', cors(), bodyParserJSON, async (req, res) => {
    const result = await controllerCategoria.inserirCategoria(req.body, req.headers['content-type']);
    res.status(result.status_code).json(result);
});
app.get('/v1/100open/categoria', cors(), async (req, res) => {
    const result = await controllerCategoria.listarCategorias();
    res.status(result.status_code).json(result);
});
app.get('/v1/100open/categoria/:id', cors(), async (req, res) => {
    const result = await controllerCategoria.buscarCategoriaPorId(req.params.id);
    res.status(result.status_code).json(result);
});
app.put('/v1/100open/categoria/:id', cors(), bodyParserJSON, async (req, res) => {
    const result = await controllerCategoria.atualizarCategoria(req.params.id, req.body, req.headers['content-type']);
    res.status(result.status_code).json(result);
});
app.delete('/v1/100open/categoria/:id', cors(), async (req, res) => {
    const result = await controllerCategoria.excluirCategoria(req.params.id);
    res.status(result.status_code).json(result);
});


/************************************
 *            EMPRESA
 ************************************/
const controllerEmpresa = require('./controller/empresa/controllerEmpresa');
app.post('/v1/100open/empresa', cors(), bodyParserJSON, async (req, res) => {
    const result = await controllerEmpresa.inserirEmpresa(req.body, req.headers['content-type']);
    res.status(result.status_code).json(result);
});

// Listar empresas de um evento (já trazendo participantes)
app.get('/v1/100open/empresa/evento/:eventoId', cors(), async (req, res) => {
    const result = await controllerEmpresa.listarEmpresasPorEvento(req.params.eventoId);
    res.status(result.status_code).json(result);
});

/************************************
 *         PARTICIPANTE
 ************************************/
const controllerParticipante = require('./controller/participante/controllerParticipante');
app.post('/v1/100open/participante', cors(), bodyParserJSON, async (req, res) => {
    const result = await controllerParticipante.inserirParticipante(req.body, req.headers['content-type']);
    res.status(result.status_code).json(result);
});
app.get('/v1/100open/participante/empresa/:empresaId', cors(), async (req, res) => {
    const result = await controllerParticipante.listarParticipantesPorEmpresa(req.params.empresaId);
    res.status(result.status_code).json(result);
});

// Exportar compras + participantes para Excel
app.get('/v1/100open/exportar-compras', async (req, res) => {
  try {
    // Buscar todas as empresas + participantes
    const [empresas] = await db.query(`
      SELECT e.id, e.nome_empresa, e.email, e.telefone, e.cpf, e.cnpj,
             ev.nome AS evento_nome
      FROM tbl_empresa e
      JOIN tbl_evento ev ON ev.id = e.evento_id
      ORDER BY ev.nome, e.nome_empresa
    `);

    const [participantes] = await db.query(`
      SELECT p.id, p.nome, p.email, p.telefone, p.genero, p.empresa_id
      FROM tbl_participante p
      ORDER BY p.empresa_id, p.nome
    `);

    // Criar planilha
    const workbook = new ExcelJS.Workbook();
    const ws = workbook.addWorksheet('Compras');

    // Cabeçalho
    ws.addRow([
      "Evento", "Empresa", "Email", "Telefone", "CPF", "CNPJ",
      "Participante", "Email Participante", "Telefone Participante", "Gênero"
    ]);

    // Linhas
    empresas.forEach(emp => {
      const parts = participantes.filter(p => p.empresa_id === emp.id);
      if (parts.length === 0) {
        ws.addRow([
          emp.evento_nome, emp.nome_empresa, emp.email, emp.telefone, emp.cpf, emp.cnpj,
          "—", "—", "—", "—"
        ]);
      } else {
        parts.forEach(p => {
          ws.addRow([
            emp.evento_nome, emp.nome_empresa, emp.email, emp.telefone, emp.cpf, emp.cnpj,
            p.nome, p.email, p.telefone, p.genero
          ]);
        });
      }
    });

    // Ajustar largura
    ws.columns.forEach(col => { col.width = 20; });

    // Enviar como download
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="compras.xlsx"'
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Erro ao exportar Excel:", err);
    res.status(500).json({ status: false, message: "Erro ao exportar Excel" });
  }
});


/************************************
 *            CUPOM
 ************************************/
const controllerCupom = require('./controller/cupom/controllerCupom');
app.post('/v1/100open/cupom', cors(), bodyParserJSON, async (req, res) => {
    const result = await controllerCupom.inserirCupom(req.body, req.headers['content-type']);
    res.status(result.status_code).json(result);
});
app.get('/v1/100open/cupom/evento/:eventoId', cors(), async (req, res) => {
    const result = await controllerCupom.listarCuponsPorEvento(req.params.eventoId);
    res.status(result.status_code).json(result);
});
app.post('/v1/100open/cupom/validar', cors(), bodyParserJSON, async (req, res) => {
    const result = await controllerCupom.validarCupom(req.body, req.headers['content-type']);
    res.status(result.status_code).json(result);
});

app.put('/v1/100open/cupom/:id', cors(), bodyParserJSON, async (req, res) => {
  const result = await controllerCupom.atualizarCupom(
    req.params.id,
    req.body,
    req.headers['content-type']
  );
  res.status(result.status_code).json(result);
});

app.delete('/v1/100open/cupom/:id', cors(), async (req, res) => {
  const result = await controllerCupom.deletarCupom(req.params.id);
  res.status(result.status_code).json(result);
});


/************************************
 *            EVENTO
 ************************************/
const controllerEvento = require('./controller/evento/controllerEvento');
app.post('/v1/100open/evento', cors(), bodyParserJSON, async (req, res) => {
    const result = await controllerEvento.inserirEvento(req.body, req.headers['content-type']);
    res.status(result.status_code).json(result);
});
app.get('/v1/100open/evento', cors(), async (req, res) => {
    const result = await controllerEvento.listarEventos();
    res.status(result.status_code).json(result);
});
app.get('/v1/100open/evento/:id', cors(), async (req, res) => {
    const result = await controllerEvento.buscarEventoPorId(req.params.id);
    res.status(result.status_code).json(result);
});
app.put('/v1/100open/evento/:id', cors(), bodyParserJSON, async (req, res) => {
    const result = await controllerEvento.atualizarEvento(req.params.id, req.body, req.headers['content-type']);
    res.status(result.status_code).json(result);
});
app.put('/v1/100open/evento/:id/cancelar', cors(), async (req, res) => {
    const result = await controllerEvento.cancelarEvento(req.params.id);
    res.status(result.status_code).json(result);
});
app.delete('/v1/100open/evento/:id', cors(), async (req, res) => {
    const result = await controllerEvento.excluirEvento(req.params.id);
    res.status(result.status_code).json(result);
});


// Iniciando o servidor
app.listen(5050, () => {
    console.log('API 100Open funcionando e aguardando requisições...');
});
