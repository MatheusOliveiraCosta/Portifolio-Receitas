const express = require('express');
const router = express.Router();
const receitaController = require('../controllers/receitaController');
const { verificarToken } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   - name: Receitas
 *     description: Gerenciamento de receitas colaborativas
 */

// ROTA PÚBLICA
/**
 * @swagger
 * /api/receitas:
 *   get:
 *     summary: Lista todas as receitas (Feed)
 *     tags:
 *       - Receitas
 *     responses:
 *       '200':
 *         description: Sucesso. Retorna a lista de receitas.
 */
router.get('/', receitaController.listarReceitas);

// ROTAS PROTEGIDAS
/**
 * @swagger
 * /api/receitas:
 *   post:
 *     summary: Cria uma nova receita
 *     tags:
 *       - Receitas
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               descricao:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Receita criada com sucesso.
 *       '401':
 *         description: Não autorizado (Token ausente ou inválido).
 */
router.post('/', verificarToken, receitaController.criarReceita);

router.put('/:id', verificarToken, receitaController.atualizarReceita);
router.delete('/:id', verificarToken, receitaController.deletarReceita);
router.post('/:id/comentarios', verificarToken, receitaController.comentarReceita);

module.exports = router;