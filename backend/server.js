const express = require('express');
const cors = require('cors');
require('dotenv').config(); 
const conectarBanco = require('./database'); 
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

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

const publicRoutes = require('./routes/publicRoutes');
app.use('/api/publico', publicRoutes);

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0', // Versão padrão atual
        info: {
            title: 'API - Painel de Receitas',
            version: '1.0.0',
            description: 'Documentação da API de Receitas Colaborativas',
        },
        servers: [
            {
                url: 'http://localhost:3000', // URL base do seu Node
            },
        ],
        // 2. Isso aqui avisa o Swagger que seu sistema usa Token JWT!
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        }
    },
    // 3. Onde o Swagger deve procurar as rotas para documentar?
    apis: ['./routes/*.js'], 
};

const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));