const Categoria = require('../models/Categoria');
const Habilidade = require('../models/Habilidade');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');

//CATEGORIAS
exports.criarCategoria = async (req, res) => {
    try {
        const novaCategoria = new Categoria({ nome: req.body.nome });
        await novaCategoria.save();
        res.status(201).json({ mensagem: 'Categoria criada!', categoria: novaCategoria });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao criar categoria', detalhe: erro.message });
    }
};

exports.listarCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.find();
        res.json(categorias);
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao buscar categorias' });
    }
};

//HABILIDADES
exports.criarHabilidade = async (req, res) => {
    try {
        const novaHabilidade = new Habilidade({ nome: req.body.nome });
        await novaHabilidade.save();
        res.status(201).json({ mensagem: 'Habilidade criada!', habilidade: novaHabilidade });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao criar habilidade', detalhe: erro.message });
    }
};

exports.listarHabilidades = async (req, res) => {
    try {
        const habilidades = await Habilidade.find();
        res.json(habilidades);
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao buscar habilidades' });
    }
};

//ALUNOS
exports.listarAlunos = async (req, res) => {
    try {
        // Busca todos que têm o perfil ALUNO, mas esconde a senha (-senha)
        const alunos = await Usuario.find({ tipo_perfil: 'ALUNO' }).select('-senha');
        res.json(alunos);
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao buscar alunos' });
    }
};

//CATEGORIAS (Editar e Excluir)
exports.atualizarCategoria = async (req, res) => {
    try {
        const categoria = await Categoria.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!categoria) return res.status(404).json({ erro: 'Categoria não encontrada' });
        res.json({ mensagem: 'Categoria atualizada!', categoria });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao atualizar categoria', detalhe: erro.message });
    }
};

exports.deletarCategoria = async (req, res) => {
    try {
        const categoria = await Categoria.findByIdAndDelete(req.params.id);
        if (!categoria) return res.status(404).json({ erro: 'Categoria não encontrada' });
        res.json({ mensagem: 'Categoria deletada com sucesso!' });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao deletar categoria', detalhe: erro.message });
    }
};

//HABILIDADES (Editar e Excluir)
exports.atualizarHabilidade = async (req, res) => {
    try {
        const habilidade = await Habilidade.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!habilidade) return res.status(404).json({ erro: 'Habilidade não encontrada' });
        res.json({ mensagem: 'Habilidade atualizada!', habilidade });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao atualizar habilidade', detalhe: erro.message });
    }
};

exports.deletarHabilidade = async (req, res) => {
    try {
        const habilidade = await Habilidade.findByIdAndDelete(req.params.id);
        if (!habilidade) return res.status(404).json({ erro: 'Habilidade não encontrada' });
        res.json({ mensagem: 'Habilidade deletada com sucesso!' });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao deletar habilidade', detalhe: erro.message });
    }
};

//ALUNOS (Criar, Editar e Excluir)
exports.criarAluno = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        
        // Criptografa a senha inicial que o Admin definiu para o aluno
        const salt = await bcrypt.genSalt(10);
        const senhaCriptografada = await bcrypt.hash(senha, salt);

        const novoAluno = new Usuario({
            nome,
            email,
            senha: senhaCriptografada,
            tipo_perfil: 'ALUNO' // Força que o admin só crie alunos por essa rota
        });

        await novoAluno.save();
        res.status(201).json({ 
            mensagem: 'Aluno cadastrado pelo Admin com sucesso!', 
            aluno: { _id: novoAluno._id, nome: novoAluno.nome, email: novoAluno.email } 
        });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao cadastrar aluno', detalhe: erro.message });
    }
};

exports.atualizarAluno = async (req, res) => {
    try {
        // Se o admin quiser mudar a senha do aluno, precisa criptografar a nova
        if (req.body.senha) {
            const salt = await bcrypt.genSalt(10);
            req.body.senha = await bcrypt.hash(req.body.senha, salt);
        }

        const alunoAtualizado = await Usuario.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        ).select('-senha');

        if (!alunoAtualizado) return res.status(404).json({ erro: 'Aluno não encontrado' });
        res.json({ mensagem: 'Dados do aluno atualizados!', aluno: alunoAtualizado });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao atualizar aluno', detalhe: erro.message });
    }
};

exports.deletarAluno = async (req, res) => {
    try {
        const alunoDeletado = await Usuario.findByIdAndDelete(req.params.id);
        if (!alunoDeletado) return res.status(404).json({ erro: 'Aluno não encontrado' });
        res.json({ mensagem: 'Aluno banido/deletado do sistema com sucesso!' });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao deletar aluno', detalhe: erro.message });
    }
};