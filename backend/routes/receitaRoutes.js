const express = require('express');
const router = express.Router();
const receitaController = require('../controllers/receitaController');
const { verificarToken } = require('../middlewares/authMiddleware');


//ROTA PÚBLICA
/**
 * @swagger
 * tags:
 * name: Receitas
 * description: Gerenciamento de receitas colaborativas
 */

/**
 * @swagger
 * /receitas:
 * get:
 * summary: Lista todas as receitas (Feed)
 * tags: [Receitas]
 * responses:
 * 200:
 * description: Sucesso. Retorna a lista de receitas.
 */
router.get('/', receitaController.listarReceitas);

/**
 * @swagger
 * /receitas:
 * post:
 * summary: Cria uma nova receita
 * tags: [Receitas]
 * security:
 * - bearerAuth: [] 
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * nome:
 * type: string
 * descricao:
 * type: string
 * responses:
 * 201:
 * description: Receita criada com sucesso.
 * 401:
 * description: Não autorizado (Token ausente ou inválido).
 */

//ROTAS PROTEGIDAS
router.post('/', verificarToken, receitaController.criarReceita);
router.put('/:id', verificarToken, receitaController.atualizarReceita);
router.delete('/:id', verificarToken, receitaController.deletarReceita);
router.post('/:id/comentarios', verificarToken, receitaController.comentarReceita);

module.exports = router;