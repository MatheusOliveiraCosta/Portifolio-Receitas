const jwt = require('jsonwebtoken');

//Verifica se o usuário tem (Token)
exports.verificarToken = (req, res, next) => {
    
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ erro: 'Acesso negado. Você precisa estar logado.' });
    }

    try {
        const tokenLimpo = token.replace('Bearer ', '');
        
        const decodificado = jwt.verify(tokenLimpo, process.env.JWT_SECRET);
        
        req.usuario = decodificado; 
        
        next();
    } catch (erro) {
        res.status(400).json({ erro: 'Token inválido ou expirado.' });
    }
};

//Verifica o usuário é um Administrador?
exports.verificarAdmin = (req, res, next) => {
    if (req.usuario.tipo_perfil !== 'ADMIN') {
        return res.status(403).json({ erro: 'Acesso restrito apenas para Administradores.' });
    }
    next();
};