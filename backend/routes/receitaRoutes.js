const express = require('express');
const router = express.Router();

//segurança
const { verificarToken, verificarAdmin } = require('../middlewares/authMiddleware');

//ROTA PÚBLIC
router.get('/', (req, res) => {
    res.json({ mensagem: 'Lista de todas as receitas vista pelo público' });
});

//ROTA PROTEGIDA
router.post('/', verificarToken, (req, res) => {
    res.json({ mensagem: `Receita criada pelo usuário de ID: ${req.usuario.id}` });
});

//ROTA RESTRITA
router.delete('/apagar-tudo', verificarToken, verificarAdmin, (req, res) => {
    res.json({ mensagem: 'Todas as receitas do sistema foram apagadas pelo Admin!' });
});

module.exports = router;