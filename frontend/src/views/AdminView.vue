<template>
  <div class="admin-container">
    <header class="cabecalho-admin">
      <h2>Painel do Administrador</h2>
      <button @click="sair" class="btn-sair">Sair do Sistema</button>
    </header>

    <main class="conteudo">
      <!-- Sistema de Abas -->
      <div class="abas">
        <button :class="{ ativo: abaAtual === 'alunos' }" @click="mudarAba('alunos')">Alunos</button>
        <button :class="{ ativo: abaAtual === 'categorias' }" @click="mudarAba('categorias')">Categorias</button>
        <button :class="{ ativo: abaAtual === 'habilidades' }" @click="mudarAba('habilidades')">Habilidades</button>
      </div>

      //Alunos
      <section v-if="abaAtual === 'alunos'" class="cartao">
        <h3>Gerenciar Alunos</h3>
        <div class="form-rapido">
          <input type="text" v-model="formAluno.nome" placeholder="Nome do Aluno" />
          <input type="email" v-model="formAluno.email" placeholder="E-mail" />
          <input type="password" v-model="formAluno.senha" placeholder="Senha Provisória" />
          <button @click="criarAluno" class="btn-salvar">Cadastrar Aluno</button>
        </div>

        <ul class="lista-admin">
          <li v-for="aluno in listaAlunos" :key="aluno._id">
            <span><strong>{{ aluno.nome }}</strong> ({{ aluno.email }})</span>
            <div class="acoes">
              <button @click="deletarAluno(aluno._id)" class="btn-del">Deletar</button>
            </div>
          </li>
        </ul>
      </section>

      //Categorias
      <section v-if="abaAtual === 'categorias'" class="cartao">
        <h3>Gerenciar Categorias</h3>
        <div class="form-rapido">
          <input type="text" v-model="novaCategoriaNome" placeholder="Nome da nova categoria" />
          <button @click="criarCategoria" class="btn-salvar">Cadastrar Categoria</button>
        </div>

        <ul class="lista-admin">
          <li v-for="cat in listaCategorias" :key="cat._id">
            <span>{{ cat.nome }}</span>
            <div class="acoes">
              <button @click="editarCategoria(cat)" class="btn-edit">Editar</button>
              <button @click="deletarCategoria(cat._id)" class="btn-del">Deletar</button>
            </div>
          </li>
        </ul>
      </section>

      //Habilidades
      <section v-if="abaAtual === 'habilidades'" class="cartao">
        <h3>Gerenciar Habilidades</h3>
        <div class="form-rapido">
          <input type="text" v-model="novaHabilidadeNome" placeholder="Nome da nova habilidade" />
          <button @click="criarHabilidade" class="btn-salvar">Cadastrar Habilidade</button>
        </div>

        <ul class="lista-admin">
          <li v-for="hab in listaHabilidades" :key="hab._id">
            <span>{{ hab.nome }}</span>
            <div class="acoes">
              <button @click="editarHabilidade(hab)" class="btn-edit">Editar</button>
              <button @click="deletarHabilidade(hab._id)" class="btn-del">Deletar</button>
            </div>
          </li>
        </ul>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();
const abaAtual = ref('alunos'); // Começa na aba de alunos

// Variáveis de Estado
const listaAlunos = ref([]);
const listaCategorias = ref([]);
const listaHabilidades = ref([]);

// Variáveis de Formulários
const formAluno = ref({ nome: '', email: '', senha: '' });
const novaCategoriaNome = ref('');
const novaHabilidadeNome = ref('');

//Carregar dados
const mudarAba = (aba) => {
  abaAtual.value = aba;
  carregarDados();
};

const carregarDados = async () => {
  try {
    if (abaAtual.value === 'alunos') {
      const res = await api.get('/admin/alunos'); // Rota que mostra todos os alunos
      listaAlunos.value = res.data;
    } else if (abaAtual.value === 'categorias') {
      const res = await api.get('/publico/categorias');
      listaCategorias.value = res.data;
    } else if (abaAtual.value === 'habilidades') {
      const res = await api.get('/publico/habilidades');
      listaHabilidades.value = res.data;
    }
  } catch (erro) {
    console.error("Erro ao carregar dados", erro);
  }
};

//CRUD alunos
const criarAluno = async () => {
  if (!formAluno.value.nome || !formAluno.value.email || !formAluno.value.senha) return alert('Preencha tudo!');
  try {
    await api.post('/admin/alunos', formAluno.value);
    formAluno.value = { nome: '', email: '', senha: '' };
    carregarDados();
  } catch (erro) { alert('Erro ao criar aluno.'); }
};

const deletarAluno = async (id) => {
  if (!confirm('Tem certeza que deseja banir este aluno?')) return;
  try {
    await api.delete(`/admin/alunos/${id}`);
    carregarDados();
  } catch (erro) { alert('Erro ao deletar aluno.'); }
};

//CRUD categorias 
const criarCategoria = async () => {
  if (!novaCategoriaNome.value) return;
  try {
    await api.post('/admin/categorias', { nome: novaCategoriaNome.value });
    novaCategoriaNome.value = '';
    carregarDados();
  } catch (erro) { alert('Erro ao criar categoria.'); }
};

const editarCategoria = async (categoria) => {
  const novoNome = prompt("Digite o novo nome da categoria:", categoria.nome);
  if (!novoNome || novoNome === categoria.nome) return;
  try {
    await api.put(`/admin/categorias/${categoria._id}`, { nome: novoNome });
    carregarDados();
  } catch (erro) { alert('Erro ao atualizar categoria.'); }
};

const deletarCategoria = async (id) => {
  if (!confirm('Tem certeza? Isso pode afetar receitas vinculadas a ela.')) return;
  try {
    await api.delete(`/admin/categorias/${id}`);
    carregarDados();
  } catch (erro) { alert('Erro ao deletar categoria.'); }
};

//CRUD habilidades
const criarHabilidade = async () => {
  if (!novaHabilidadeNome.value) return;
  try {
    await api.post('/admin/habilidades', { nome: novaHabilidadeNome.value });
    novaHabilidadeNome.value = '';
    carregarDados();
  } catch (erro) { alert('Erro ao criar habilidade.'); }
};

const editarHabilidade = async (habilidade) => {
  const novoNome = prompt("Digite o novo nome da habilidade:", habilidade.nome);
  if (!novoNome || novoNome === habilidade.nome) return;
  try {
    await api.put(`/admin/habilidades/${habilidade._id}`, { nome: novoNome });
    carregarDados();
  } catch (erro) { alert('Erro ao atualizar habilidade.'); }
};

const deletarHabilidade = async (id) => {
  if (!confirm('Tem certeza que deseja deletar?')) return;
  try {
    await api.delete(`/admin/habilidades/${id}`);
    carregarDados();
  } catch (erro) { alert('Erro ao deletar habilidade.'); }
};

const sair = () => {
  localStorage.removeItem('token');
  router.push('/login'); 
};

onMounted(() => {
  carregarDados();
});
</script>

<style scoped>
.admin-container { max-width: 900px; margin: 0 auto; padding: 20px; }
.cabecalho-admin { display: flex; justify-content: space-between; align-items: center; background: #333; color: gold; padding: 15px 25px; border-radius: 8px; margin-bottom: 20px; }
.btn-sair { background-color: #ff4d4d; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: bold; }

.abas { display: flex; gap: 10px; margin-bottom: 20px; }
.abas button { flex: 1; padding: 12px; font-size: 1rem; border: none; background: #e0e0e0; cursor: pointer; border-radius: 5px; font-weight: bold; transition: 0.3s; }
.abas button.ativo { background: #4CAF50; color: white; }

.cartao { background: white; padding: 25px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
.form-rapido { display: flex; gap: 10px; margin-bottom: 25px; background: #f9f9f9; padding: 15px; border-radius: 8px; border: 1px solid #eee; }
.form-rapido input { flex: 1; padding: 10px; border: 1px solid #ccc; border-radius: 5px; }
.btn-salvar { background: #2196F3; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; font-weight: bold; }

.lista-admin { list-style: none; padding: 0; margin: 0; }
.lista-admin li { display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #eee; }
.lista-admin li:hover { background: #fcfcfc; }
.acoes { display: flex; gap: 8px; }
.btn-edit { background: #ff9800; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 0.85rem; }
.btn-del { background: #f44336; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 0.85rem; }
</style>