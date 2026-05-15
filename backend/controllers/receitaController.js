const Receita = require('../models/Receita');

//(Create)
exports.criarReceita = async (req, res) => {
    try {
    
        const { nome, descricao, link_externo, categorias, autores } = req.body;
        
        let listaFinalDeAutores = autores || [];

        if (!listaFinalDeAutores.includes(req.usuario.id)) {
            listaFinalDeAutores.push(req.usuario.id);
        }

        const novaReceita = new Receita({
            nome,
            descricao,
            link_externo,
            categorias,
            autores: listaFinalDeAutores 
        });

        await novaReceita.save();
        res.status(201).json({ mensagem: 'Receita criada com sucesso!', receita: novaReceita });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao criar receita', detalhe: erro.message });
    }
};

//(Read)
exports.listarReceitas = async (req, res) => {
    try {
        const categoriaId = req.query.categoria;
        let filtroDeBusca = {}; 

        if (categoriaId) {
            filtroDeBusca.categorias = categoriaId;
        }

        const receitas = await Receita.find(filtroDeBusca)
            .sort({ createdAt: -1 })
            .populate('autores', 'nome email') 
            .populate('categorias', 'nome')
            .populate('comentarios.autor', 'nome');

        res.json(receitas);
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao buscar receitas', detalhe: erro.message });
    }
    
};

//(Update)
exports.atualizarReceita = async (req, res) => {
    try {
        const receita = await Receita.findById(req.params.id);
        
        if (!receita) {
            return res.status(404).json({ erro: 'Receita não encontrada' });
        }

        const ehAutor = receita.autores.some(id => id.toString() === req.usuario.id);
        const ehAdmin = req.usuario.tipo_perfil === 'ADMIN';

        if (!ehAutor && !ehAdmin) {
            return res.status(403).json({ erro: 'Ação não permitida. Você não é um dos responsáveis.' });
        }

        const receitaAtualizada = await Receita.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ mensagem: 'Receita atualizada!', receita: receitaAtualizada });

    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao atualizar', detalhe: erro.message });
    }
};

//(Delete)
exports.deletarReceita = async (req, res) => {
    try {
        const receita = await Receita.findById(req.params.id);
        
        if (!receita) {
            return res.status(404).json({ erro: 'Receita não encontrada' });
        }

        // Mesma trava: qualquer um dos autores responsáveis pode deletar
        const ehAutor = receita.autores.some(id => id.toString() === req.usuario.id);
        const ehAdmin = req.usuario.tipo_perfil === 'ADMIN';

        if (!ehAutor && !ehAdmin) {
            return res.status(403).json({ erro: 'Ação não permitida.' });
        }

        await Receita.findByIdAndDelete(req.params.id);
        res.json({ mensagem: 'Receita deletada com sucesso!' });

    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao deletar', detalhe: erro.message });
    }
};

//(Create Comentario)
exports.comentarReceita = async (req, res) => {
    try {
        const receita = await Receita.findById(req.params.id);
        if (!receita) return res.status(404).json({ erro: 'Receita não encontrada' });

        // Cria o objeto do comentário usando o ID do aluno logado (do token)
        const novoComentario = {
            texto: req.body.texto,
            autor: req.usuario.id 
        };

        // Empurra o comentário novo para dentro da lista e salva!
        receita.comentarios.push(novoComentario);
        await receita.save();

        res.status(201).json({ mensagem: 'Comentário adicionado com sucesso!' });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao comentar', detalhe: erro.message });
    }
};