<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Portfólio de Receitas</h2>
      <p>Faça login para gerenciar seu perfil</p>

      <form @submit.prevent="fazerLogin">
        <div class="input-group">
          <label>E-mail</label>
          <input type="email" v-model="email" required placeholder="Digite seu e-mail" />
        </div>

        <div class="input-group">
          <label>Senha</label>
          <input type="password" v-model="senha" required placeholder="Digite sua senha" />
        </div>

        <button type="submit" class="btn-entrar" :disabled="carregando">
          {{ carregando ? 'Entrando...' : 'Entrar' }}
        </button>

        <p v-if="erro" class="mensagem-erro">{{ erro }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const email = ref('');
const senha = ref('');
const erro = ref('');
const carregando = ref(false);
const router = useRouter();

const fazerLogin = async () => {
  try {
    carregando.value = true;
    erro.value = '';
    
    const resposta = await api.post('/auth/login', {
      email: email.value,
      senha: senha.value
    });

    localStorage.setItem('token', resposta.data.token);
    
    // Verifica se é o email do chefe!
    if (email.value === 'admin@utfpr.edu.br') { // ⚠️ COLOQUE O SEU E-MAIL DE ADMIN AQUI
      router.push('/admin'); 
    } else {
      router.push('/painel'); 
    }

  } catch (err) {
    erro.value = err.response?.data?.erro || 'Erro ao conectar com o servidor.';
  } finally {
    carregando.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f7f6;
}

.login-box {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.input-group {
  margin-bottom: 20px;
  text-align: left;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.input-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

.btn-entrar {
  width: 100%;
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-entrar:hover {
  background-color: #45a049;
}

.btn-entrar:disabled {
  background-color: #9e9e9e;
  cursor: not-allowed;
}

.mensagem-erro {
  color: red;
  margin-top: 15px;
  font-size: 14px;
}
</style>