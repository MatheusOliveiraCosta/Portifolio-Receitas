const mongoose = require('mongoose');

const CategoriaSchema = new mongoose.Schema({
    nome: { 
        type: String, 
        required: true, 
        unique: true // Não deixa criar duas categorias com o mesmo nome
    }
});

module.exports = mongoose.model('Categoria', CategoriaSchema);