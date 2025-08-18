const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'posts.json');
const QUESTIONS_FILE = path.join(__dirname, 'questions.json');
const QUIZZES_FILE = path.join(__dirname, 'quizzes.json');

// Middleware
app.use(cors());
app.use(express.json());

// Função para ler os posts do arquivo JSON
async function readPosts() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Se o arquivo não existir, retorna array vazio
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// Função para salvar os posts no arquivo JSON
async function savePosts(posts) {
  await fs.writeFile(DATA_FILE, JSON.stringify(posts, null, 2));
}

// Função para ler as questões do arquivo JSON
async function readQuestions() {
  try {
    const data = await fs.readFile(QUESTIONS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Se o arquivo não existir, retorna array vazio
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// Função para salvar as questões no arquivo JSON
async function saveQuestions(questions) {
  await fs.writeFile(QUESTIONS_FILE, JSON.stringify(questions, null, 2));
}

// Função para ler os questionários do arquivo JSON
async function readQuizzes() {
  try {
    const data = await fs.readFile(QUIZZES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Se o arquivo não existir, retorna array vazio
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// Função para salvar os questionários no arquivo JSON
async function saveQuizzes(quizzes) {
  await fs.writeFile(QUIZZES_FILE, JSON.stringify(quizzes, null, 2));
}

// GET - Buscar todos os posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await readPosts();
    // Ordenar por data mais recente
    const sortedPosts = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(sortedPosts);
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

    const posts = await readPosts();
    
    const newPost = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description?.trim() || '',
      content: content?.trim() || '',
      audioLink: audioLink?.trim() || '',
      pdfLink: pdfLink?.trim() || '',
      quizId: quizId?.trim() || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    posts.push(newPost);
    await savePosts(posts);
    
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

    const posts = await readPosts();
    const postIndex = posts.findIndex(post => post.id === id);
    
    if (postIndex === -1) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    posts[postIndex] = {
      ...posts[postIndex],
      title: title.trim(),
      description: description?.trim() || '',
      content: content?.trim() || '',
      audioLink: audioLink?.trim() || '',
      pdfLink: pdfLink?.trim() || '',
      quizId: quizId?.trim() || '',
      updatedAt: new Date().toISOString()
    };

    await savePosts(posts);
    res.json(posts[postIndex]);
  } catch (error) {
    console.error('Erro ao atualizar post:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE - Deletar post
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const posts = await readPosts();
    const filteredPosts = posts.filter(post => post.id !== id);
    
    if (filteredPosts.length === posts.length) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    await savePosts(filteredPosts);
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
    const questions = await readQuestions();
    // Ordenar por matéria e depois por data mais recente
    const sortedQuestions = questions.sort((a, b) => {
      if (a.materia !== b.materia) {
        return a.materia.localeCompare(b.materia);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    res.json(sortedQuestions);
  } catch (error) {
    console.error('Erro ao buscar questões:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET - Buscar questões por matéria
app.get('/api/questions/materia/:materia', async (req, res) => {
  try {
    const { materia } = req.params;
    const questions = await readQuestions();
    const filteredQuestions = questions.filter(q => 
      q.materia.toLowerCase() === materia.toLowerCase()
    );
    res.json(filteredQuestions);
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

    const questions = await readQuestions();
    
    const newQuestion = {
      id: Date.now().toString(),
      materia: materia.trim(),
      enunciado: enunciado.trim(),
      alternativas: alternativas.map((alt, index) => ({
        letra: String.fromCharCode(65 + index), // A, B, C, D
        texto: alt.trim()
      })),
      correta: correta.toUpperCase(),
      feedbacks: feedbacks.map((feedback, index) => ({
        letra: String.fromCharCode(65 + index),
        texto: feedback.trim()
      })),
      dica: dica.trim(),
      explicacao: explicacao.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    questions.push(newQuestion);
    await saveQuestions(questions);
    
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

    const questions = await readQuestions();
    const questionIndex = questions.findIndex(q => q.id === id);
    
    if (questionIndex === -1) {
      return res.status(404).json({ error: 'Questão não encontrada' });
    }

    questions[questionIndex] = {
      ...questions[questionIndex],
      materia: materia.trim(),
      enunciado: enunciado.trim(),
      alternativas: alternativas.map((alt, index) => ({
        letra: String.fromCharCode(65 + index),
        texto: alt.trim()
      })),
      correta: correta.toUpperCase(),
      feedbacks: feedbacks.map((feedback, index) => ({
        letra: String.fromCharCode(65 + index),
        texto: feedback.trim()
      })),
      dica: dica.trim(),
      explicacao: explicacao.trim(),
      updatedAt: new Date().toISOString()
    };

    await saveQuestions(questions);
    res.json(questions[questionIndex]);
  } catch (error) {
    console.error('Erro ao atualizar questão:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE - Deletar questão
app.delete('/api/questions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const questions = await readQuestions();
    const filteredQuestions = questions.filter(q => q.id !== id);
    
    if (filteredQuestions.length === questions.length) {
      return res.status(404).json({ error: 'Questão não encontrada' });
    }

    await saveQuestions(filteredQuestions);
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
    const quizzes = await readQuizzes();
    // Ordenar por data mais recente
    const sortedQuizzes = quizzes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(sortedQuizzes);
  } catch (error) {
    console.error('Erro ao buscar questionários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET - Buscar questionário por ID
app.get('/api/quizzes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const quizzes = await readQuizzes();
    const quiz = quizzes.find(q => q.id === id);
    
    if (!quiz) {
      return res.status(404).json({ error: 'Questionário não encontrado' });
    }

    // Buscar as questões do questionário
    const questions = await readQuestions();
    const quizQuestions = questions.filter(q => quiz.questionIds.includes(q.id));
    
    res.json({
      ...quiz,
      questions: quizQuestions
    });
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

    // Verificar se as questões existem
    const questions = await readQuestions();
    const validQuestionIds = questionIds.filter(id => 
      questions.some(q => q.id === id)
    );

    if (validQuestionIds.length !== questionIds.length) {
      return res.status(400).json({ error: 'Algumas questões não foram encontradas' });
    }

    const quizzes = await readQuizzes();
    
    const newQuiz = {
      id: Date.now().toString(),
      titulo: titulo.trim(),
      descricao: descricao?.trim() || '',
      materia: materia?.trim() || '',
      questionIds: validQuestionIds,
      tempoEstimado: tempoEstimado || 30, // em minutos
      instrucoes: instrucoes?.trim() || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    quizzes.push(newQuiz);
    await saveQuizzes(quizzes);
    
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

    // Verificar se as questões existem
    const questions = await readQuestions();
    const validQuestionIds = questionIds.filter(id => 
      questions.some(q => q.id === id)
    );

    if (validQuestionIds.length !== questionIds.length) {
      return res.status(400).json({ error: 'Algumas questões não foram encontradas' });
    }

    const quizzes = await readQuizzes();
    const quizIndex = quizzes.findIndex(q => q.id === id);
    
    if (quizIndex === -1) {
      return res.status(404).json({ error: 'Questionário não encontrado' });
    }

    quizzes[quizIndex] = {
      ...quizzes[quizIndex],
      titulo: titulo.trim(),
      descricao: descricao?.trim() || '',
      materia: materia?.trim() || '',
      questionIds: validQuestionIds,
      tempoEstimado: tempoEstimado || 30,
      instrucoes: instrucoes?.trim() || '',
      updatedAt: new Date().toISOString()
    };

    await saveQuizzes(quizzes);
    res.json(quizzes[quizIndex]);
  } catch (error) {
    console.error('Erro ao atualizar questionário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE - Deletar questionário
app.delete('/api/quizzes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const quizzes = await readQuizzes();
    const filteredQuizzes = quizzes.filter(q => q.id !== id);
    
    if (filteredQuizzes.length === quizzes.length) {
      return res.status(404).json({ error: 'Questionário não encontrado' });
    }

    await saveQuizzes(filteredQuizzes);
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

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 API disponível em: http://localhost:${PORT}/api/posts`);
  console.log(`❓ API de questões em: http://localhost:${PORT}/api/questions`);
  console.log(`📝 API de questionários em: http://localhost:${PORT}/api/quizzes`);
});
