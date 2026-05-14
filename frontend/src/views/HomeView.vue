<template>
  <div class="home-container">
    <header class="cabecalho-publico">
      <h1>Portfólio de Receitas</h1>
      <button @click="irParaLogin" class="btn-login">Acesso Restrito (Login)</button>
    </header>

    <main class="conteudo">
      <div class="barra-ferramentas">
        <div class="filtro">
          <label><strong>Filtrar por Categoria:</strong></label>
          <select v-model="categoriaSelecionada" class="select-categoria">
            <option value="">Todas as Categorias</option>
            <option v-for="cat in listaCategorias" :key="cat._id" :value="cat._id">
              {{ cat.nome }}
            </option>
          </select>
        </div>
        
        <button @click="carregarRelatorio" class="btn-relatorio">Ver Estatísticas da Turma</button>
      </div>

      <div class="grid-receitas">
        <div v-for="receita in receitasFiltradas" :key="receita._id" class="card-receita">
          <h3 class="titulo-receita">{{ receita.nome }}</h3>
          <p class="desc-receita">{{ receita.descricao }}</p>
          
          <div class="tags-categorias">
            <span v-for="cat in receita.categorias" :key="cat._id" class="tag">{{ cat.nome }}</span>
          </div>
          
          <p class="autores"><strong>Chef(s):</strong> <span v-for="autor in receita.autores" :key="autor._id">{{ autor.nome }}, </span></p>
          
          <a v-if="receita.link_externo" :href="receita.link_externo" target="_blank" class="btn-link">Ver Receita Completa</a>
        </div>
      </div>
      
      <p v-if="receitasFiltradas.length === 0" class="texto-vazio" style="text-align: center; margin-top: 40px;">
        Nenhuma receita encontrada para este filtro.
      </p>
    </main>

    <div v-if="mostrarRelatorio" class="modal-fundo">
      <div class="modal-conteudo">
        <h2>Relatório de Habilidades</h2>
        <p>Proporção de alunos que dominam cada habilidade:</p>
        
        <ul class="lista-relatorio">
          <li v-for="(item, index) in dadosRelatorio" :key="index">
            <span>{{ item.nome }}</span>
            <strong>{{ item.porcentagem }}% dos alunos</strong>
          </li>
        </ul>
        
        <button @click="mostrarRelatorio = false" class="btn-fechar-modal">Fechar Relatório</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();

const listaReceitas = ref([]);
const listaCategorias = ref([]);
const categoriaSelecionada = ref('');

// Lógica do Relatório
const mostrarRelatorio = ref(false);
const dadosRelatorio = ref([]);

const irParaLogin = () => {
  router.push('/login');
};

const carregarDadosPublicos = async () => {
  try {
    const [resReceitas, resCategorias] = await Promise.all([
      api.get('/publico/receitas'),
      api.get('/publico/categorias')
    ]);
    listaReceitas.value = resReceitas.data;
    listaCategorias.value = resCategorias.data;
  } catch (erro) {
    console.error("Erro ao carregar dados", erro);
  }
};

const carregarRelatorio = async () => {
  try {
    const resposta = await api.get('/publico/relatorio');
    dadosRelatorio.value = resposta.data;
    mostrarRelatorio.value = true;
  } catch (erro) {
    alert("Erro ao gerar relatório");
  }
};

const receitasFiltradas = computed(() => {
  if (!categoriaSelecionada.value) return listaReceitas.value;
  
  return listaReceitas.value.filter(receita => 
    receita.categorias.some(cat => cat._id === categoriaSelecionada.value)
  );
});

onMounted(() => {
  carregarDadosPublicos();
});
</script>

<style scoped>
.home-container { background-color: #f4f7f6; min-height: 100vh; padding-bottom: 50px; }
.cabecalho-publico { display: flex; justify-content: space-between; align-items: center; background: #000000; color: white; padding: 20px 50px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
.cabecalho-publico h1 { margin: 0; font-size: 1.8rem; }
.btn-login { background: white; color: #000000; border: none; padding: 10px 20px; font-weight: bold; border-radius: 5px; cursor: pointer; transition: 0.2s; }
.btn-login:hover { background: #fff3e0; }

.conteudo { max-width: 1200px; margin: 0 auto; padding: 30px 20px; }
.barra-ferramentas { display: flex; justify-content: space-between; align-items: center; background: white; padding: 15px 25px; border-radius: 8px; margin-bottom: 30px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
.select-categoria { padding: 8px; margin-left: 10px; border-radius: 5px; border: 1px solid #ccc; font-size: 1rem; }
.btn-relatorio { background: #2196f3; color: white; border: none; padding: 10px 15px; font-weight: bold; border-radius: 5px; cursor: pointer; }

.grid-receitas { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
.card-receita { background: white; border-radius: 10px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); display: flex; flex-direction: column; transition: transform 0.2s; }
.card-receita:hover { transform: translateY(-5px); box-shadow: 0 6px 12px rgba(0,0,0,0.1); }
.titulo-receita { margin: 0 0 10px 0; color: #333; }
.desc-receita { color: #666; font-size: 0.95rem; flex-grow: 1; }
.tags-categorias { margin: 10px 0; display: flex; flex-wrap: wrap; gap: 5px; }
.tag { background: #ffe0b2; color: #000000; font-size: 0.8rem; font-weight: bold; padding: 3px 8px; border-radius: 12px; }
.autores { font-size: 0.85rem; color: #888; border-top: 1px solid #eee; padding-top: 10px; margin-bottom: 15px; }
.btn-link { text-align: center; background: #4caf50; color: white; text-decoration: none; padding: 10px; border-radius: 5px; font-weight: bold; }

/* CSS do Modal (A Janela do Relatório) */
.modal-fundo { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.modal-conteudo { background: white; padding: 30px; border-radius: 10px; width: 90%; max-width: 500px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
.lista-relatorio { list-style: none; padding: 0; margin: 20px 0; }
.lista-relatorio li { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; font-size: 1.1rem; }
.btn-fechar-modal { width: 100%; background: #f44336; color: white; border: none; padding: 12px; font-weight: bold; border-radius: 5px; cursor: pointer; margin-top: 10px; }
</style>