const express = require('express');
const router = express.Router();
const relatorioController = require('../controllers/relatorioController');

// ROTA PÚBLICA
router.get('/habilidades', relatorioController.relatorioHabilidades);

module.exports = router;