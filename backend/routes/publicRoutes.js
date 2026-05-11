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

const Receita = require('../models/Receita');
const Usuario = require('../models/Usuario');

// Rota pública para listar TODAS as receitas (Req 1.7)
router.get('/receitas', async (req, res) => {
    try {
        // Traz as receitas e já "traduz" os IDs para os nomes dos autores e categorias
        const receitas = await Receita.find()
            .populate('autores', 'nome')
            .populate('categorias', 'nome');
        res.json(receitas);
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao buscar receitas' });
    }
});

// Rota do Relatório Estatístico (Req 1.9)
router.get('/relatorio', async (req, res) => {
    try {
        const totalAlunos = await Usuario.countDocuments({ tipo_perfil: 'ALUNO' });
        if (totalAlunos === 0) return res.json([]);

        const habilidades = await Habilidade.find();
        const relatorio = [];

        for (let hab of habilidades) {
            const alunosComEssaHab = await Usuario.countDocuments({
                tipo_perfil: 'ALUNO',
                'habilidades.habilidade': hab._id
            });
            
            const porcentagem = (alunosComEssaHab / totalAlunos) * 100;
            relatorio.push({
                nome: hab.nome,
                porcentagem: porcentagem.toFixed(1) // Deixa com 1 casa decimal (ex: 33.3%)
            });
        }

        res.json(relatorio);
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao gerar relatório' });
    }
});

module.exports = router;