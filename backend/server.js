const express = require('express');
const cors = require('cors');
require('dotenv').config(); 
const conectarBanco = require('./database'); 

const app = express();

app.use(cors());
app.use(express.json());

conectarBanco();

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

app.get('/api/teste', (req, res) => {
    res.json({ mensagem: "A API do portfólio está viva e conectada!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

const receitaRoutes = require('./routes/receitaRoutes');
app.use('/api/receitas', receitaRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

const alunoRoutes = require('./routes/alunoRoutes');
app.use('/api/alunos', alunoRoutes);

const relatorioRoutes = require('./routes/relatorioRoutes');
app.use('/api/relatorios', relatorioRoutes);