const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

const { verificarToken, verificarAdmin } = require('../middlewares/authMiddleware');

router.use(verificarToken, verificarAdmin);

//Rotas de Categorias
router.post('/categorias', adminController.criarCategoria);
router.get('/categorias', adminController.listarCategorias);

//Rotas de Habilidades
router.post('/habilidades', adminController.criarHabilidade);
router.get('/habilidades', adminController.listarHabilidades);

//Rota de Alunos
router.get('/alunos', adminController.listarAlunos);

// Rotas de Edição e Exclusão de Categorias
router.put('/categorias/:id', adminController.atualizarCategoria);
router.delete('/categorias/:id', adminController.deletarCategoria);

// Rotas de Edição e Exclusão de Habilidades
router.put('/habilidades/:id', adminController.atualizarHabilidade);
router.delete('/habilidades/:id', adminController.deletarHabilidade);

// Rotas de Gerenciamento de Alunos
router.post('/alunos', adminController.criarAluno);
router.put('/alunos/:id', adminController.atualizarAluno);
router.delete('/alunos/:id', adminController.deletarAluno);

module.exports = router;