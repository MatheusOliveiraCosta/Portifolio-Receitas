const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    tipo_perfil: { type: String, enum: ['ALUNO', 'ADMIN'], default: 'ALUNO' },
    
    //relacionamento N:N
    habilidades: [{
        habilidade: { type: mongoose.Schema.Types.ObjectId, ref: 'Habilidade' },
        nivel: { type: Number, min: 0, max: 10, required: true }
    }],
    data_criacao: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Usuario', usuarioSchema);