const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/alunoController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.post('/habilidades', verificarToken, alunoController.adicionarHabilidade);

router.put('/habilidades/:id', verificarToken, alunoController.atualizarHabilidade);

router.delete('/habilidades/:id', verificarToken, alunoController.removerHabilidade);

router.get('/perfil', verificarToken, alunoController.meuPerfil);

module.exports = router;