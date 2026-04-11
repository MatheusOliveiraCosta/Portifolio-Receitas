// models/Receita.js
const mongoose = require('mongoose');

const receitaSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    descricao: { type: String, required: true },
    link_externo: { type: String },
    
    // Relacionamento N:N (Uma receita tem vários autores/alunos responsáveis)
    autores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }],
    
    // Relacionamento N:N (Uma receita tem várias categorias)
    categorias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Categoria' }],
    
    data_criacao: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Receita', receitaSchema);