const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'posts.json');

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
    const { title, description, content, audioLink, pdfLink } = req.body;
    
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
    const { title, description, content, audioLink, pdfLink } = req.body;
    
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
});
