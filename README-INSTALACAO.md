# 🚀 MeuSemestre - Sistema de Organização por Matérias

## 📋 Pré-requisitos

- **Node.js** versão 16 ou superior
- **MongoDB** rodando localmente ou em nuvem
- **Git** para clonar o repositório

## 🛠️ Instalação

### 1. Clone o repositório
```bash
git clone [URL_DO_REPOSITORIO]
cd MeuSemestre
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o banco de dados
Crie um arquivo `.env` na raiz do projeto:
```env
MONGODB_URI=mongodb://localhost:27017/meusemestre
PORT=3001
NODE_ENV=development
```

## 🚀 Como Iniciar o Sistema

### Opção 1: Iniciar Tudo de Uma Vez (Recomendado)
```bash
# Windows
iniciar-tudo.bat

# Linux/Mac
./iniciar-tudo.sh
```

### Opção 2: Iniciar Separadamente

#### Backend (Porta 3001)
```bash
# Windows
iniciar-servidor.bat

# Linux/Mac
npm run server
```

#### Frontend (Porta 3000)
```bash
# Windows
iniciar-frontend.bat

# Linux/Mac
npm start
```

## 🌐 URLs de Acesso

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Posts**: http://localhost:3001/api/posts
- **Matérias**: http://localhost:3001/api/posts/materias
- **Questões**: http://localhost:3001/api/questions
- **Questionários**: http://localhost:3001/api/quizzes

## 🎯 Funcionalidades Implementadas

### ✨ Sistema de Organização por Matérias
- **Filtro elegante** no topo do feed
- **25+ matérias predefinidas** com emojis
- **Seleção obrigatória** na criação de posts
- **Compatibilidade total** com posts existentes
- **Migração automática** de dados antigos

### 🎨 Design e UX
- **Interface discreta** com tons dourados
- **Elementos sutis** que não chamam atenção excessiva
- **Responsivo** para mobile e desktop
- **Animações suaves** e transições elegantes

### 🔧 Funcionalidades Técnicas
- **Filtragem em tempo real** sem recarregar página
- **Índices otimizados** no MongoDB
- **API RESTful** com filtros por matéria
- **Migração segura** de dados existentes

## 📱 Como Usar

### 1. Acesse o Sistema
- Abra http://localhost:3000 no navegador
- O feed mostrará o filtro de matérias no topo

### 2. Filtrar Posts
- Use o dropdown para selecionar uma matéria específica
- Clique em "Limpar" para ver todos os posts
- O contador mostra quantos posts estão sendo exibidos

### 3. Criar Novo Post
- Clique em "Admin" e faça login
- Preencha o formulário incluindo a matéria
- O post será automaticamente categorizado

### 4. Visualizar Posts
- Cada post mostra uma badge dourada com a matéria
- Filtre por matéria para organizar seu estudo
- Mantenha o filtro "Todas as Matérias" para visão geral

## 🔍 Estrutura dos Arquivos

```
MeuSemestre/
├── 📁 config/          # Configuração do banco
├── 📁 models/          # Schemas do MongoDB
├── 📁 services/        # Lógica de negócio
├── 📁 src/            # Frontend React
│   ├── 📁 components/  # Componentes React
│   └── 📁 services/    # Serviços de API
├── 📄 server.js        # Servidor Express
├── 📄 iniciar-tudo.bat # Script principal (Windows)
├── 📄 iniciar-servidor.bat # Backend (Windows)
└── 📄 iniciar-frontend.bat # Frontend (Windows)
```

## 🚨 Solução de Problemas

### Porta já em uso
```bash
# Verificar processos
netstat -ano | findstr :3001
netstat -ano | findstr :3000

# Encerrar processo (substitua PID pelo número do processo)
taskkill /PID [PID] /F
```

### Erro de conexão com MongoDB
- Verifique se o MongoDB está rodando
- Confirme a string de conexão no arquivo `.env`
- Teste a conexão: `mongo` ou `mongosh`

### Dependências não instaladas
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

## 🔄 Migração de Dados

O sistema automaticamente:
- ✅ Migra posts existentes para o novo schema
- ✅ Adiciona campo "materia" como "Geral" para posts antigos
- ✅ Preserva todos os dados existentes
- ✅ Mantém compatibilidade retroativa

## 📊 Testando a API

### Verificar se está funcionando
```bash
# Testar endpoint de posts
curl http://localhost:3001/api/posts

# Testar endpoint de matérias
curl http://localhost:3001/api/posts/materias

# Testar filtro por matéria
curl "http://localhost:3001/api/posts?materia=Geral"
```

## 🚀 Deploy em Produção

### 1. Build do Frontend
```bash
npm run build
```

### 2. Configurar Variáveis de Ambiente
```env
NODE_ENV=production
MONGODB_URI=[URL_DO_MONGODB_PRODUCAO]
PORT=[PORTA_DO_SERVIDOR]
```

### 3. Iniciar Servidor
```bash
node server.js
```

## 📞 Suporte

Para dúvidas ou problemas:
- Verifique os logs do servidor
- Confirme se todas as dependências estão instaladas
- Teste a conectividade com o MongoDB
- Verifique se as portas estão livres

---

**🎉 Sistema pronto para uso!** 

O MeuSemestre agora possui um sistema completo de organização por matérias, mantendo total compatibilidade com seus dados existentes.
