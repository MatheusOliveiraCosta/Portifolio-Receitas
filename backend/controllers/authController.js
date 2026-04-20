const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Login
exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        //Verifica se o email existe no banco
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        }

        // Compara a senha digitada com a senha criptografada do banco
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ erro: 'Senha incorreta' });
        }

        //(Token JWT)para o usuário permanecer logado
        const token = jwt.sign(
            { id: usuario._id, tipo_perfil: usuario.tipo_perfil },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // O login dura 1 dia
        );

        res.json({ 
            mensagem: 'Login realizado com sucesso!', 
            token: token,
            perfil: usuario.tipo_perfil 
        });

    } catch (erro) {
        res.status(500).json({ erro: 'Erro no servidor', detalhe: erro.message });
    }
};

//Cadastro
exports.registrar = async (req, res) => {
    try {
        const { nome, email, senha, tipo_perfil } = req.body;

        const salt = await bcrypt.genSalt(10);
        const senhaCriptografada = await bcrypt.hash(senha, salt);

        //Salvar
        const novoUsuario = new Usuario({
            nome,
            email,
            senha: senhaCriptografada,
            tipo_perfil
        });

        await novoUsuario.save();
        res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });

    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao cadastrar', detalhe: erro.message });
    }
};