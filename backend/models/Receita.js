const mongoose = require('mongoose');

const ReceitaSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    descricao: { type: String, required: true },
    link_externo: { type: String },
    
    categorias: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Categoria' 
    }],
    
    autores: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario' 
    }]
});

module.exports = mongoose.model('Receita', ReceitaSchema);