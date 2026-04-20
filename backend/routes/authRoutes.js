const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota de cadastro: POST http://localhost:3000/api/auth/registrar
router.post('/registrar', authController.registrar);

// Rota de login: POST http://localhost:3000/api/auth/login
router.post('/login', authController.login);

module.exports = router;