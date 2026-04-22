const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    tipo_perfil: { type: String, enum: ['ALUNO', 'ADMIN'], default: 'ALUNO' },
    
    // REQUISITO 1.4: Nova gaveta para as habilidades (Nota de 0 a 10)
    habilidades: [{
        habilidade: { type: mongoose.Schema.Types.ObjectId, ref: 'Habilidade' },
        nivel: { type: Number, min: 0, max: 10, required: true }
    }]
});

module.exports = mongoose.model('Usuario', UsuarioSchema);