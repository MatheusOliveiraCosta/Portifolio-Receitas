const Receita = require('../models/Receita');

//(Create)
exports.criarReceita = async (req, res) => {
    try {
        const { nome, descricao, link_externo, categorias } = req.body;
        
        const novaReceita = new Receita({
            nome,
            descricao,
            link_externo,
            categorias,
            autores: [req.usuario.id] 
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
        //Pega a categoria da URL
        const categoriaId = req.query.categoria;

        //caixa de pesquisa
        let filtroDeBusca = {}; 

        if (categoriaId) {
            filtroDeBusca.categorias = categoriaId;
        }

        const receitas = await Receita.find(filtroDeBusca)
            .populate('autores', 'nome email');

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

        //verifica se é o admin
        const ehAutor = receita.autores.includes(req.usuario.id);
        const ehAdmin = req.usuario.tipo_perfil === 'ADMIN';

        if (!ehAutor && !ehAdmin) {
            return res.status(403).json({ erro: 'Ação não permitida. Você não é o dono desta receita.' });
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

        //TRAVA
        const ehAutor = receita.autores.includes(req.usuario.id);
        const ehAdmin = req.usuario.tipo_perfil === 'ADMIN';

        if (!ehAutor && !ehAdmin) {
            return res.status(403).json({ erro: 'Ação não permitida. Você não é o dono desta receita.' });
        }

        await Receita.findByIdAndDelete(req.params.id);
        res.json({ mensagem: 'Receita deletada com sucesso!' });

    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao deletar', detalhe: erro.message });
    }
};