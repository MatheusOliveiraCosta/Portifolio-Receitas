const Usuario = require('../models/Usuario');
const Habilidade = require('../models/Habilidade');

exports.relatorioHabilidades = async (req, res) => {
    try {
        const totalAlunos = await Usuario.countDocuments({ tipo_perfil: 'ALUNO' });

        if (totalAlunos === 0) {
            return res.json({ mensagem: "Nenhum aluno cadastrado no sistema ainda." });
        }

        const todasHabilidades = await Habilidade.find();
        
        const estatisticas = [];

        for (let hab of todasHabilidades) {
            const alunosComEstaHabilidade = await Usuario.countDocuments({
                tipo_perfil: 'ALUNO',
                'habilidades.habilidade': hab._id // Procura dentro da gaveta de habilidades do aluno
            });

            const proporcao = ((alunosComEstaHabilidade / totalAlunos) * 100).toFixed(2);

            estatisticas.push({
                habilidade: hab.nome,
                total_alunos_com_habilidade: alunosComEstaHabilidade,
                proporcao_porcentagem: `${proporcao}%`
            });
        }

        res.json({
            total_de_alunos_no_sistema: totalAlunos,
            relatorio: estatisticas
        });

    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao gerar relatório', detalhe: erro.message });
    }
};