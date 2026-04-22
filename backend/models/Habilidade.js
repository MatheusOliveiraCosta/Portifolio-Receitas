const mongoose = require('mongoose');

const HabilidadeSchema = new mongoose.Schema({
    nome: { 
        type: String, 
        required: true, 
        unique: true 
    }
});

module.exports = mongoose.model('Habilidade', HabilidadeSchema);