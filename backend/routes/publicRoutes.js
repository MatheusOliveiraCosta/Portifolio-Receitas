const express = require('express');
const router = express.Router();
const Categoria = require('../models/Categoria');
const Habilidade = require('../models/Habilidade');

// Rotas abertas para carregar os menus de seleção no Front-end
router.get('/categorias', async (req, res) => {
    const categorias = await Categoria.find();
    res.json(categorias);
});

router.get('/habilidades', async (req, res) => {
    const habilidades = await Habilidade.find();
    res.json(habilidades);
});

module.exports = router;