<template>
  <div class="painel-container">
    <header class="cabecalho">
      <h2>Bem-vindo(a), {{ aluno.nome || 'Carregando...' }} 🧑‍🍳</h2>
      <button @click="sair" class="btn-sair">Sair do Sistema</button>
    </header>

    <main class="conteudo">
      <section class="cartao">
        <h3>Minhas Habilidades</h3>
        
        <div v-if="aluno.habilidades && aluno.habilidades.length > 0">
          <ul class="lista-habilidades">
            <li v-for="item in aluno.habilidades" :key="item._id" class="item-lista">
              <div>
                <span><strong>{{ item.habilidade?.nome }}</strong></span>
                <span class="nota">Nível: {{ item.nivel }}/10</span>
              </div>
              <div class="acoes">
                <button @click="editarHabilidade(item)" class="btn-edit">✏️</button>
                <button @click="deletarHabilidade(item.habilidade._id)" class="btn-del">🗑️</button>
              </div>
            </li>
          </ul>
        </div>
        <p v-else class="texto-vazio">Você ainda não cadastrou nenhuma habilidade.</p>
        
        <div v-if="mostrarFormHabilidade" class="caixa-formulario">
          <select v-model="novaHabilidadeId" class="input-form">
            <option value="" disabled>Selecione uma habilidade...</option>
            <option v-for="hab in listaHabilidades" :key="hab._id" :value="hab._id">{{ hab.nome }}</option>
          </select>
          <input type="number" v-model="novoNivel" min="0" max="10" placeholder="Nota (0 a 10)" class="input-form" />
          
          <div class="botoes-form">
            <button @click="salvarHabilidade" class="btn-salvar">Salvar</button>
            <button @click="mostrarFormHabilidade = false" class="btn-cancelar">Cancelar</button>
          </div>
        </div>

        <button v-else @click="abrirFormularioHabilidade" class="btn-acao mt-10">+ Adicionar Habilidade</button>
      </section>

      <section class="cartao">
        <h3>Minhas Receitas</h3>
        
        <div v-if="minhasReceitas.length > 0">
          <ul class="lista-habilidades">
            <li v-for="receita in minhasReceitas" :key="receita._id" class="item-receita">
              <div style="flex: 1;">
                <strong>{{ receita.nome }}</strong>
                <p class="desc-receita">{{ receita.descricao }}</p>
                <a v-if="receita.link_externo" :href="receita.link_externo" target="_blank" class="link-receita">Acessar Link</a>
              </div>
              <div class="acoes mt-10">
                <button @click="prepararEdicao(receita)" class="btn-edit">✏️ Editar</button>
                <button @click="deletarReceita(receita._id)" class="btn-del">🗑️ Excluir</button>
              </div>
            </li>
          </ul>
        </div>
        <p v-else class="texto-vazio">Nenhuma receita cadastrada ainda.</p>
        
        <div v-if="mostrarFormReceita" class="caixa-formulario">
          <input type="text" v-model="novaReceita.nome" placeholder="Nome da Receita" class="input-form" />
          <textarea v-model="novaReceita.descricao" placeholder="Descrição rápida" class="input-form" rows="3"></textarea>
          <input type="url" v-model="novaReceita.link_externo" placeholder="Link (ex: https://youtube.com/...)" class="input-form" />
          
          <div class="selecao-categorias">
            <p><strong>Categorias:</strong></p>
            <label v-for="cat in listaCategorias" :key="cat._id" class="check-categoria">
              <input type="checkbox" :value="cat._id" v-model="novaReceita.categorias" />
              {{ cat.nome }}
            </label>
          </div>
          
          <div class="selecao-categorias mt-10">
            <p><strong>Colegas (Co-autores):</strong></p>
            <label v-for="colega in listaColegas" :key="colega._id" class="check-categoria">
              <input type="checkbox" :value="colega._id" v-model="novaReceita.autores" />
              {{ colega.nome }}
            </label>
          </div>
          
          <div class="botoes-form mt-10">
            <button @click="salvarReceita" class="btn-salvar">Salvar Receita</button>
            <button @click="cancelarEdicaoReceita" class="btn-cancelar">Cancelar</button>
          </div>
        </div>

        <button v-else @click="abrirFormularioReceita" class="btn-acao mt-10">+ Nova Receita</button>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();
const aluno = ref({}); 
const listaColegas = ref([]);

// Lógica de Habilidades
const mostrarFormHabilidade = ref(false);
const listaHabilidades = ref([]);
const novaHabilidadeId = ref('');
const novoNivel = ref('');

// Lógica de Receitas
const minhasReceitas = ref([]);
const mostrarFormReceita = ref(false);
const listaCategorias = ref([]);
const novaReceita = ref({
  nome: '',
  descricao: '',
  link_externo: '',
  categorias: [],
  autores: []
});
const receitaEmEdicaoId = ref(null);

// Carrega o Perfil e depois as Receitas
const carregarPerfil = async () => {
  try {
    const resposta = await api.get('/alunos/perfil');
    aluno.value = resposta.data;
    carregarMinhasReceitas(); // Chama as receitas logo após saber quem é o aluno logado
  } catch (erro) {
    alert('Sessão expirada. Faça login novamente.');
    sair();
  }
};

// ================= FUNÇÕES DE RECEITAS =================
const carregarMinhasReceitas = async () => {
  try {
    const resposta = await api.get('/receitas');
    // Filtra para pegar só as receitas onde a Maria está na lista de autores
    minhasReceitas.value = resposta.data.filter(receita => 
      receita.autores.some(autor => autor._id === aluno.value._id)
    );
  } catch (erro) {
    console.error('Erro ao buscar receitas', erro);
  }
};

const abrirFormularioReceita = async () => {
  try {
    // Busca categorias e alunos ao mesmo tempo!
    // (Atenção: verifique se a rota '/admin/alunos' é permitida para os alunos lerem no seu back-end,
    // se der erro de permissão, você pode precisar criar uma rota pública para listar os nomes).
    const [resCategorias, resAlunos] = await Promise.all([
      api.get('/publico/categorias'),
      api.get('/publico/alunos')
    ]);
    
    listaCategorias.value = resCategorias.data;
    
    // Salva a lista de alunos, mas tira o próprio aluno logado para ele não marcar a si mesmo
    listaColegas.value = resAlunos.data.filter(a => a._id !== aluno.value._id);
    
    mostrarFormReceita.value = true;
  } catch (erro) {
    alert('Erro ao carregar dados do formulário.');
  }
};

const prepararEdicao = async (receita) => {
  await abrirFormularioReceita(); // Primeiro carrega as categorias e os alunos do banco
  
  receitaEmEdicaoId.value = receita._id; // Avisa o sistema que é uma edição
  
  // Preenche os campos com os dados da receita clicada
  novaReceita.value = {
    nome: receita.nome,
    descricao: receita.descricao,
    link_externo: receita.link_externo,
    // Extrai só os IDs para as caixinhas (checkbox) ficarem marcadas automaticamente
    categorias: receita.categorias ? receita.categorias.map(c => c._id) : [],
    autores: receita.autores ? receita.autores.map(a => a._id) : []
  };
};

const salvarReceita = async () => {
  if (!novaReceita.value.nome || !novaReceita.value.descricao) {
    return alert('Preencha pelo menos o Nome e a Descrição!');
  }
  
  try {
    if (receitaEmEdicaoId.value) {
      // Se a variável tem um ID, fazemos um PUT (Requisito 1.5 - Editar)
      await api.put(`/receitas/${receitaEmEdicaoId.value}`, novaReceita.value);
    } else {
      // Se está vazia, fazemos um POST (Criar nova)
      await api.post('/receitas', novaReceita.value);
    }
    
    cancelarEdicaoReceita(); // Limpa e fecha o formulário
    carregarMinhasReceitas(); // Atualiza a lista na tela
  } catch (erro) {
    alert(erro.response?.data?.erro || 'Erro ao salvar receita');
  }
};

const cancelarEdicaoReceita = () => {
  // Limpa tudo e sai do modo de edição
  novaReceita.value = { nome: '', descricao: '', link_externo: '', categorias: [], autores: [] };
  receitaEmEdicaoId.value = null; 
  mostrarFormReceita.value = false;
};

const deletarReceita = async (id) => {
  // Requisito 1.5 - Excluir
  if (!confirm('Tem certeza que deseja excluir esta receita para sempre?')) return;
  
  try {
    await api.delete(`/receitas/${id}`);
    carregarMinhasReceitas(); // Atualiza a lista na tela após deletar
  } catch (erro) {
    alert(erro.response?.data?.erro || 'Erro ao excluir receita.');
  }
};

// ================= FUNÇÕES DE HABILIDADES E LOGOUT =================
const abrirFormularioHabilidade = async () => {
  try {
    const resposta = await api.get('/publico/habilidades');
    listaHabilidades.value = resposta.data;
    mostrarFormHabilidade.value = true;
  } catch (erro) {
    alert('Erro ao carregar lista de habilidades.');
  }
};

const salvarHabilidade = async () => {
  if (!novaHabilidadeId.value || novoNivel.value === '') return alert('Preencha tudo!');
  try {
    await api.post('/alunos/habilidades', {
      habilidade_id: novaHabilidadeId.value,
      nivel: Number(novoNivel.value)
    });
    mostrarFormHabilidade.value = false;
    novaHabilidadeId.value = '';
    novoNivel.value = '';
    carregarPerfil();
  } catch (erro) {
    alert(erro.response?.data?.erro || 'Erro ao salvar habilidade');
  }
};

const editarHabilidade = async (item) => {
  const novoNivel = prompt(`Digite o novo nível (0 a 10) para ${item.habilidade.nome}:`, item.nivel);
  if (novoNivel === null || novoNivel === '') return;
  
  try {
    // Atualiza enviando a nova nota
    await api.put(`/alunos/habilidades/${item.habilidade._id}`, { nivel: Number(novoNivel) });
    carregarPerfil();
  } catch (erro) {
    alert('Erro ao atualizar habilidade.');
  }
};

const deletarHabilidade = async (idHabilidade) => {
  if (!confirm('Tem certeza que deseja remover esta habilidade?')) return;
  try {
    await api.delete(`/alunos/habilidades/${idHabilidade}`);
    carregarPerfil();
  } catch (erro) {
    alert('Erro ao remover habilidade.');
  }
};

const sair = () => {
  localStorage.removeItem('token');
  router.push('/'); 
};

onMounted(() => {
  carregarPerfil();
});
</script>

<style scoped>
/* CSS Anterior Mantido */
.painel-container { max-width: 900px; margin: 0 auto; padding: 20px; }
.cabecalho { display: flex; justify-content: space-between; align-items: center; background: white; padding: 15px 25px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); margin-bottom: 20px; }
.btn-sair { background-color: #ff4d4d; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: bold; }
.conteudo { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
@media (max-width: 768px) { .conteudo { grid-template-columns: 1fr; } } /* Responsivo para celular */
.cartao { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
.lista-habilidades { list-style: none; padding: 0; }
.lista-habilidades li { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee; }
.nota { background: #e8f5e9; color: #2e7d32; padding: 2px 8px; border-radius: 12px; font-size: 0.9em; font-weight: bold; }
.texto-vazio { color: #777; font-style: italic; }
.btn-acao { background-color: #2196F3; color: white; border: none; padding: 10px; border-radius: 5px; width: 100%; cursor: pointer; font-weight: bold; transition: 0.2s; }
.btn-acao:hover { background-color: #1976D2; }
.mt-10 { margin-top: 15px; }

/* CSS dos Formulários */
.caixa-formulario { margin-top: 15px; background: #f9f9f9; padding: 15px; border-radius: 8px; border: 1px solid #ddd; }
.input-form { width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-family: inherit; }
.botoes-form { display: flex; gap: 10px; }
.btn-salvar { background-color: #4CAF50; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; flex: 1; font-weight: bold;}
.btn-cancelar { background-color: #9e9e9e; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; flex: 1; font-weight: bold;}

/* CSS Específico para Receitas */
.item-receita { flex-direction: column; align-items: flex-start !important; }
.desc-receita { margin: 5px 0; color: #555; font-size: 0.9em; }
.link-receita { color: #2196F3; text-decoration: none; font-size: 0.85em; font-weight: bold; }
.link-receita:hover { text-decoration: underline; }
.selecao-categorias { margin-bottom: 15px; background: white; padding: 10px; border: 1px solid #ccc; border-radius: 4px; max-height: 100px; overflow-y: auto; }
.check-categoria { display: block; margin-bottom: 5px; font-size: 0.9em; cursor: pointer; }
</style>