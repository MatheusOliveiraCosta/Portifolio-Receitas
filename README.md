# Portifolio-Receitas - Plataforma Colaborativa

Um sistema Full-Stack desenvolvido para gerenciamento e compartilhamento de receitas entre alunos. O sistema conta com controle de acesso, painel de administração e sistema de colaboração mútua, permitindo que vários alunos sejam co-autores de uma mesma receita.

## 🛠️ Tecnologias Utilizadas
* **Front-end:** Vue.js
* **Back-end:** Node.js, Express
* **Banco de Dados:** MongoDB
* **Autenticação:** JWT (JSON Web Token)

---

## ⚙️ Pré-requisitos para rodar em uma nova máquina

Antes de começar, você precisa ter as seguintes ferramentas instaladas no seu computador:
1. [Node.js](https://nodejs.org/) (Recomendado versão LTS)
2. [MongoDB Community Server](https://www.mongodb.com/try/download/community) (Versão 8.2 ou compatível)
3. [Postman](https://www.postman.com/) (Para a configuração inicial do Administrador)

---

## 🚀 Passo a Passo de USO

### 1. Clonar ou copiar o projeto
Baixe a pasta do projeto para o novo computador e abra o repositório no seu editor de código (ex: VS Code).

### 2. Instalar as dependências
Você precisará instalar os pacotes tanto do Back-end quanto do Front-end.
Abra o terminal na pasta raiz do projeto e rode:

**No Back-end:**
```bash
cd backend
npm install
```
**No Front-end:**
```bash
cd frontend
npm install
```

### 3. Configurar as Variáveis de Ambiente (.env)
Crie um arquivo chamado .env dentro da pasta backend/ e adicione as suas credenciais. Exemplo:

```Snippet de código
MONGO_URI=mongodb://127.0.0.1:27017/portfolio_receitas
PORT=3000
JWT_SECRET=minha_chave_secreta_super_segura_123
```
## Como rodar o sistema (SIGA A ORDEM)

### Passo 1: Ligar o Banco de Dados (MongoDB)

Abra o Prompt de Comando (cmd) do Windows como Administrador.
Cole o comando abaixo e aperte Enter (Ajuste o caminho se o seu MongoDB foi instalado em outra pasta):
```DOS
"C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath="C:\Program Files\MongoDB\Server\8.2\data" --setParameter diagnosticDataCollectionEnabled=false
```
A tela preta vai processar os arquivos e ficar aguardando conexões. NÃO feche essa tela, apenas minimize-a.

### Passo 2: Ligar a API (Back-end)

Abra o terminal na pasta backend.
Rode o comando:
```Bash
npm run dev
```
Aguarde a mensagem: Conectado ao MongoDB.

### Passo 3: Ligar a Interface (Front-end)

Abra um novo terminal na pasta frontend.
Rode o comando:
```Bash
npm run dev
```
Acesse o link gerado (http://localhost:5173) no seu navegador.

## Fazer uso do sistema (ADMIN)

Como o banco de dados da nova máquina estará zerado, você precisa criar o usuário Administrador via Postman para liberar o sistema.

Com o Back-end rodando, abra o Postman.
Crie uma requisição POST para http://localhost:3000/api/auth/registrar (ajuste a rota conforme o seu código).
No corpo (Body > raw > JSON), envie:
```JSON
{
  "nome": "Admin",
  "email": "admin@utfpr.edu.br", 
  "senha": "senha_segura_123"
  "tipo_perfil": "ADMIN"
}
```
Vá para o Front-end no navegador, faça o login com *admin@utfpr.edu.br* e cadastre os alunos pelo Painel de administração

## Como Desligar o Sistema Corretamente

1. Para não corromper os dados e evitar o travamento do banco (erro de arquivo mongod.lock), siga o procedimento de encerramento seguro:

2. Nos terminais do Front-end e Back-end, pressione Ctrl + C e confirme com S para desligar os servidores Node.

3. Maximize a tela preta do MongoDB.

4. Pressione Ctrl + C APENAS UMA VEZ.

Aguarde alguns segundos até que o banco salve os arquivos e encerre o processo sozinho. Quando a linha de comando normal do Windows voltar, você pode fechar a janela.

