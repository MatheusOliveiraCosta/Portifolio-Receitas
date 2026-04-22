const Usuario = require('../models/Usuario');

exports.adicionarHabilidade = async (req, res) => {
    try {
        const { habilidade_id, nivel } = req.body;

        if (nivel < 0 || nivel > 10) {
            return res.status(400).json({ erro: 'O nível da habilidade deve ser entre 0 e 10.' });
        }

        const alunoAtualizado = await Usuario.findByIdAndUpdate(
            req.usuario.id, 
            { $push: { habilidades: { habilidade: habilidade_id, nivel: nivel } } },
            { new: true }
        ).populate('habilidades.habilidade', 'nome');

        res.json({ mensagem: 'Habilidade adicionada ao seu perfil!', aluno: alunoAtualizado });

    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao adicionar habilidade', detalhe: erro.message });
    }
};

//EDITAR E REMOVER HABILIDADES
exports.atualizarHabilidade = async (req, res) => {
    try {
        const { nivel } = req.body;

        if (nivel < 0 || nivel > 10) {
            return res.status(400).json({ erro: 'O nível da habilidade deve ser entre 0 e 10.' });
        }

        const alunoAtualizado = await Usuario.findOneAndUpdate(
            { _id: req.usuario.id, 'habilidades.habilidade': req.params.id },
            { $set: { 'habilidades.$.nivel': nivel } },
            { new: true }
        ).populate('habilidades.habilidade', 'nome').select('-senha');

        if (!alunoAtualizado) {
            return res.status(404).json({ erro: 'Habilidade não encontrada no seu perfil.' });
        }

        res.json({ mensagem: 'Nível da habilidade atualizado com sucesso!', aluno: alunoAtualizado });

    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao atualizar habilidade', detalhe: erro.message });
    }
};

//Aluno deleta uma habilidade do próprio perfil
exports.removerHabilidade = async (req, res) => {
    try {

        const alunoAtualizado = await Usuario.findByIdAndUpdate(
            req.usuario.id,
            { 
                $pull: { 
                    habilidades: { 
                        $or: [
                            { habilidade: req.params.id }, 
                            { _id: req.params.id }
                        ] 
                    } 
                } 
            },
            { new: true }
        ).populate('habilidades.habilidade', 'nome').select('-senha');

        res.json({ mensagem: 'Habilidade removida do seu perfil!', aluno: alunoAtualizado });

    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao remover habilidade', detalhe: erro.message });
    }
};

//VER PERFIL
exports.meuPerfil = async (req, res) => {
    try {
        const aluno = await Usuario.findById(req.usuario.id)
            .populate('habilidades.habilidade', 'nome')
            .select('-senha');

        if (!aluno) {
            return res.status(404).json({ erro: 'Aluno não encontrado' });
        }

        res.json(aluno);

    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao buscar perfil', detalhe: erro.message });
    }
};