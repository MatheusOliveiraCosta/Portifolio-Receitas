const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Carrega as variáveis do arquivo .env

const conectarBanco = require('./database'); // Importa o nosso arquivo de conexão

const app = express();

// Middlewares essenciais
app.use(cors());
app.use(express.json());

// Inicia a conexão com o MongoDB
conectarBanco();

// Rota de teste
app.get('/api/teste', (req, res) => {
    res.json({ mensagem: "A API ESTA CONECTADA" });
});

// Iniciando o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});