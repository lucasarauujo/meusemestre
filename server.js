require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

// Configuração do banco de dados
const connectDB = require('./config/database');

// Serviços
const questionService = require('./services/questionService');
const quizService = require('./services/quizService');
const postService = require('./services/postService');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Inicialização do sistema
async function initializeServices() {
  try {
    // Conecta ao banco de dados
    await connectDB();
    
    // Inicializa os serviços
    await questionService.initialize();
    await quizService.initialize();
    await postService.initialize();
    
    console.log('✅ Todos os serviços inicializados com sucesso!');
  } catch (error) {
    console.error('❌ Erro na inicialização:', error);
  }
}

// GET - Buscar todos os posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await postService.getAllPosts();
    res.json(posts);
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST - Criar novo post
app.post('/api/posts', async (req, res) => {
  try {
    const { title, description, content, audioLink, pdfLink, quizId } = req.body;
    
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Título é obrigatório' });
    }

    const newPost = await postService.createPost({
      title,
      description,
      content,
      audioLink,
      pdfLink,
      quizId
    });
    
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Erro ao criar post:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT - Atualizar post existente
app.put('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, content, audioLink, pdfLink, quizId } = req.body;
    
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Título é obrigatório' });
    }

    const updatedPost = await postService.updatePost(id, {
      title,
      description,
      content,
      audioLink,
      pdfLink,
      quizId
    });
    
    if (!updatedPost) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    res.json(updatedPost);
  } catch (error) {
    console.error('Erro ao atualizar post:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE - Deletar post
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await postService.deletePost(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar post:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ===== ENDPOINTS PARA QUESTÕES =====

// GET - Buscar todas as questões
app.get('/api/questions', async (req, res) => {
  try {
    const questions = await questionService.getAllQuestions();
    res.json(questions);
  } catch (error) {
    console.error('Erro ao buscar questões:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET - Buscar questões por matéria
app.get('/api/questions/materia/:materia', async (req, res) => {
  try {
    const { materia } = req.params;
    const questions = await questionService.getQuestionsByMateria(materia);
    res.json(questions);
  } catch (error) {
    console.error('Erro ao buscar questões por matéria:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST - Criar nova questão
app.post('/api/questions', async (req, res) => {
  try {
    const { 
      materia, 
      enunciado, 
      alternativas, 
      correta, 
      feedbacks, 
      dica, 
      explicacao 
    } = req.body;
    
    // Validações
    if (!materia || !enunciado || !alternativas || !correta || !feedbacks || !dica || !explicacao) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    if (!Array.isArray(alternativas) || alternativas.length !== 4) {
      return res.status(400).json({ error: 'Deve ter exatamente 4 alternativas' });
    }

    if (!['A', 'B', 'C', 'D'].includes(correta)) {
      return res.status(400).json({ error: 'Alternativa correta deve ser A, B, C ou D' });
    }

    if (!Array.isArray(feedbacks) || feedbacks.length !== 4) {
      return res.status(400).json({ error: 'Deve ter feedbacks para as 4 alternativas' });
    }

    const newQuestion = await questionService.createQuestion({
      materia,
      enunciado,
      alternativas,
      correta,
      feedbacks,
      dica,
      explicacao
    });
    
    res.status(201).json(newQuestion);
  } catch (error) {
    console.error('Erro ao criar questão:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT - Atualizar questão existente
app.put('/api/questions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      materia, 
      enunciado, 
      alternativas, 
      correta, 
      feedbacks, 
      dica, 
      explicacao 
    } = req.body;
    
    // Validações
    if (!materia || !enunciado || !alternativas || !correta || !feedbacks || !dica || !explicacao) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    if (!Array.isArray(alternativas) || alternativas.length !== 4) {
      return res.status(400).json({ error: 'Deve ter exatamente 4 alternativas' });
    }

    if (!['A', 'B', 'C', 'D'].includes(correta)) {
      return res.status(400).json({ error: 'Alternativa correta deve ser A, B, C ou D' });
    }

    if (!Array.isArray(feedbacks) || feedbacks.length !== 4) {
      return res.status(400).json({ error: 'Deve ter feedbacks para as 4 alternativas' });
    }

    const updatedQuestion = await questionService.updateQuestion(id, {
      materia,
      enunciado,
      alternativas,
      correta,
      feedbacks,
      dica,
      explicacao
    });
    
    if (!updatedQuestion) {
      return res.status(404).json({ error: 'Questão não encontrada' });
    }

    res.json(updatedQuestion);
  } catch (error) {
    console.error('Erro ao atualizar questão:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE - Deletar questão
app.delete('/api/questions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await questionService.deleteQuestion(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Questão não encontrada' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar questão:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ===== ENDPOINTS PARA QUESTIONÁRIOS =====

// GET - Buscar todos os questionários
app.get('/api/quizzes', async (req, res) => {
  try {
    const quizzes = await quizService.getAllQuizzes();
    res.json(quizzes);
  } catch (error) {
    console.error('Erro ao buscar questionários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET - Buscar questionário por ID
app.get('/api/quizzes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await quizService.getQuizById(id);
    
    if (!quiz) {
      return res.status(404).json({ error: 'Questionário não encontrado' });
    }

    res.json(quiz);
  } catch (error) {
    console.error('Erro ao buscar questionário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST - Criar novo questionário
app.post('/api/quizzes', async (req, res) => {
  try {
    const { 
      titulo, 
      descricao, 
      materia, 
      questionIds,
      tempoEstimado,
      instrucoes 
    } = req.body;
    
    // Validações
    if (!titulo || !titulo.trim()) {
      return res.status(400).json({ error: 'Título é obrigatório' });
    }

    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      return res.status(400).json({ error: 'Deve ter pelo menos uma questão' });
    }

    const newQuiz = await quizService.createQuiz({
      titulo,
      descricao,
      materia,
      questionIds,
      tempoEstimado,
      instrucoes
    });
    
    res.status(201).json(newQuiz);
  } catch (error) {
    console.error('Erro ao criar questionário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT - Atualizar questionário existente
app.put('/api/quizzes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      titulo, 
      descricao, 
      materia, 
      questionIds,
      tempoEstimado,
      instrucoes 
    } = req.body;
    
    // Validações
    if (!titulo || !titulo.trim()) {
      return res.status(400).json({ error: 'Título é obrigatório' });
    }

    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      return res.status(400).json({ error: 'Deve ter pelo menos uma questão' });
    }

    const updatedQuiz = await quizService.updateQuiz(id, {
      titulo,
      descricao,
      materia,
      questionIds,
      tempoEstimado,
      instrucoes
    });
    
    if (!updatedQuiz) {
      return res.status(404).json({ error: 'Questionário não encontrado' });
    }

    res.json(updatedQuiz);
  } catch (error) {
    console.error('Erro ao atualizar questionário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE - Deletar questionário
app.delete('/api/quizzes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await quizService.deleteQuiz(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Questionário não encontrado' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar questionário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Servir arquivos estáticos do React em produção
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

// Inicializa o servidor
async function startServer() {
  await initializeServices();
  
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📊 API disponível em: http://localhost:${PORT}/api/posts`);
    console.log(`❓ API de questões em: http://localhost:${PORT}/api/questions`);
    console.log(`📝 API de questionários em: http://localhost:${PORT}/api/quizzes`);
  });
}

startServer().catch(error => {
  console.error('❌ Erro ao iniciar servidor:', error);
  process.exit(1);
});
