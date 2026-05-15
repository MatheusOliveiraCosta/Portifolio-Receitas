const express = require('express');
const router = express.Router();
const receitaController = require('../controllers/receitaController');
const { verificarToken } = require('../middlewares/authMiddleware');


//ROTA PÚBLICA
router.get('/', receitaController.listarReceitas);

//ROTAS PROTEGIDAS
router.post('/', verificarToken, receitaController.criarReceita);
router.put('/:id', verificarToken, receitaController.atualizarReceita);
router.delete('/:id', verificarToken, receitaController.deletarReceita);
router.post('/:id/comentarios', verificarToken, receitaController.comentarReceita);

module.exports = router;