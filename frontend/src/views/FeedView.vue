<template>
  <div class="feed-container">
    <header class="cabecalho-feed">
      <h2>Feed de Receitas</h2>
      <div class="menu-navegacao">
        <button @click="irParaPainel" class="btn-voltar">Voltar para Meu Painel</button>
      </div>
    </header>

    <main class="conteudo-feed">
      <div v-if="carregando" class="carregando">Buscando receitas fresquinhas...</div>
      
      <div v-else-if="todasReceitas.length > 0" class="lista-feed">
        <article v-for="receita in todasReceitas" :key="receita._id" class="cartao-receita">
          <div class="cabecalho-cartao">
            <h3>{{ receita.nome }}</h3>
            <span class="autores">
              Feito por: 
              <span v-for="(autor, index) in receita.autores" :key="autor._id">
                {{ autor.nome }}<span v-if="index < receita.autores.length - 1">, </span>
              </span>
            </span>
          </div>
          
          <p class="descricao">{{ receita.descricao }}</p>

          <div class="area-comentarios">
            <h4>Comentários ({{ receita.comentarios?.length || 0 }})</h4>
            
            <ul v-if="receita.comentarios?.length > 0" class="lista-comentarios">
              <li v-for="comentario in receita.comentarios" :key="comentario._id">
                <strong>{{ comentario.autor?.nome }}:</strong> {{ comentario.texto }}
              </li>
            </ul>
            <p v-else class="texto-vazio-comentario">Seja o primeiro a comentar!</p>

            <div class="form-comentario">
              <input type="text" v-model="novoComentario[receita._id]" placeholder="Escreva um comentário..." />
              <button @click="enviarComentario(receita._id)">Enviar</button>
            </div>
          </div>
          
          <div class="rodape-cartao">
            <div class="tags-categorias">
              <span v-for="cat in receita.categorias" :key="cat._id" class="tag">{{ cat.nome }}</span>
            </div>
            <a v-if="receita.link_externo" :href="receita.link_externo" target="_blank" class="btn-link">Ver Receita Completa</a>
          </div>
        </article>
      </div>
      
      <p v-else class="texto-vazio">O feed está vazio! Seja o primeiro a postar uma receita.</p>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();
const todasReceitas = ref([]);
const carregando = ref(true);

const carregarFeed = async () => {
  try {
    // Busca TODAS as receitas (a rota já é pública no seu back-end)
    const resposta = await api.get('/receitas');
    todasReceitas.value = resposta.data;
  } catch (erro) {
    console.error('Erro ao carregar o feed:', erro);
  } finally {
    carregando.value = false;
  }
};

const irParaPainel = () => {
  router.push('/painel');
};

onMounted(() => {
  carregarFeed();
});

const novoComentario = ref({}); 

const enviarComentario = async (idReceita) => {
  const texto = novoComentario.value[idReceita];
  if (!texto) return; //Não envia vazio

  try {
    await api.post(`/receitas/${idReceita}/comentarios`, { texto });
    novoComentario.value[idReceita] = '';
    carregarFeed(); //Recarrega
  } catch (erro) {
    alert('Erro ao enviar comentário.');
  }
};
</script>



<style scoped>
.feed-container { max-width: 800px; margin: 0 auto; padding: 20px; }
.cabecalho-feed { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
.btn-voltar { background: #9e9e9e; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: bold; }
.lista-feed { display: flex; flex-direction: column; gap: 20px; }
.cartao-receita { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.08); border-left: 5px solid #785828; }
.cabecalho-cartao h3 { margin: 0 0 5px 0; color: #333; }
.autores { font-size: 0.85em; color: #666; font-style: italic; }
.descricao { margin: 15px 0; color: #444; line-height: 1.5; }
.rodape-cartao { display: flex; justify-content: space-between; align-items: center; margin-top: 15px; border-top: 1px solid #eee; padding-top: 15px; }
.tags-categorias { display: flex; gap: 8px; flex-wrap: wrap; }
.tag { background: #865f24; color: #ffffff; padding: 4px 10px; border-radius: 20px; font-size: 0.8em; font-weight: bold; }
.btn-link { background: #2196F3; color: white; text-decoration: none; padding: 8px 15px; border-radius: 5px; font-weight: bold; font-size: 0.9em; transition: 0.2s; }
.btn-link:hover { background: #1976D2; }
.carregando, .texto-vazio { text-align: center; color: #666; font-size: 1.2em; padding: 40px; }
.area-comentarios { margin-top: 15px; background: #f9f9f9; padding: 15px; border-radius: 8px; }
.lista-comentarios { list-style: none; padding: 0; margin-bottom: 15px; font-size: 0.9em; }
.lista-comentarios li { border-bottom: 1px dashed #ccc; padding: 8px 0; }
.form-comentario { display: flex; gap: 10px; }
.form-comentario input { flex: 1; padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
.form-comentario button { background: #4CAF50; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; }
.texto-vazio-comentario { font-size: 0.85em; color: #888; font-style: italic; }
</style>