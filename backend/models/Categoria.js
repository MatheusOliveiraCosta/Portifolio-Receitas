const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
    nome: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Categoria', categoriaSchema);

// models/Habilidade.js
const mongoose = require('mongoose');

const habilidadeSchema = new mongoose.Schema({
    nome: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Habilidade', habilidadeSchema);