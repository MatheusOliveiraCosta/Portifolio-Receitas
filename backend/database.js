const mongoose = require('mongoose');

const conectarBanco = async () => {
    try {
        // Tenta conectar usando a variável de ambiente
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado ao MongoDB');
    } catch (erro) {
        // Se algo der errado (ex: esqueceu de abrir o MongoDB no PC)
        console.error('Erro!!!', erro.message);
        process.exit(1); // Derruba o servidor para não rodar com falhas
    }
};

module.exports = conectarBanco;