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
    ref: 'Usuario',
    required: true
    }],

    comentarios: [{
        texto: { type: String, required: true },
        autor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
        criadoEm: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('Receita', ReceitaSchema);