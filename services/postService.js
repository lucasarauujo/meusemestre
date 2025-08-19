const Post = require('../models/Post');
const fs = require('fs').promises;
const path = require('path');

const POSTS_FILE = path.join(__dirname, '..', 'posts.json');

class PostService {
  constructor() {
    this.useDatabase = false;
  }

  // Inicializa o serviço e verifica se pode usar MongoDB
  async initialize() {
    try {
      if (Post && Post.db && Post.db.readyState === 1) {
        this.useDatabase = true;
        console.log('📊 PostService: Usando MongoDB');
        await this.migrateFromJSON();
      } else {
        console.log('📄 PostService: Usando arquivos JSON');
      }
    } catch (error) {
      console.log('📄 PostService: Fallback para JSON devido a erro:', error.message);
    }
  }

  // Migra dados do JSON para MongoDB (apenas uma vez)
  async migrateFromJSON() {
    try {
      const count = await Post.countDocuments();
      if (count > 0) return; // Já tem dados no banco

      const jsonData = await this.readFromJSON();
      if (jsonData.length === 0) return;

      console.log(`🔄 Migrando ${jsonData.length} posts do JSON para MongoDB...`);
      
      for (const item of jsonData) {
        const post = new Post({
          title: item.title,
          description: item.description,
          content: item.content,
          audioLink: item.audioLink,
          pdfLink: item.pdfLink,
          quizId: item.quizId || null
        });
        
        // Preserva as datas originais
        if (item.createdAt) post.createdAt = new Date(item.createdAt);
        if (item.updatedAt) post.updatedAt = new Date(item.updatedAt);
        
        await post.save();
      }
      
      console.log('✅ Migração de posts concluída!');
    } catch (error) {
      console.error('❌ Erro na migração de posts:', error);
    }
  }

  // Lê dados do arquivo JSON
  async readFromJSON() {
    try {
      const data = await fs.readFile(POSTS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  // Salva dados no arquivo JSON
  async saveToJSON(posts) {
    await fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2));
  }

  // ===== MÉTODOS PÚBLICOS =====

  async getAllPosts() {
    if (this.useDatabase) {
      return await Post.find()
        .populate('quizId', 'titulo descricao')
        .sort({ createdAt: -1 })
        .lean();
    } else {
      const posts = await this.readFromJSON();
      return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }

  async createPost(postData) {
    if (this.useDatabase) {
      let quizId = null;
      
      // Validar quizId se fornecido
      if (postData.quizId && postData.quizId.trim() !== '') {
        const id = postData.quizId.trim();
        // Verificar se é um ObjectId válido (24 caracteres hexadecimais)
        if (id.length === 24 && /^[a-fA-F0-9]{24}$/.test(id)) {
          quizId = id;
        } else {
          console.warn(`QuizId inválido ignorado: ${id}`);
          // Não lança erro, apenas ignora o quizId inválido
        }
      }

      const transformedData = {
        ...postData,
        quizId: quizId
      };

      const post = new Post(transformedData);
      return await post.save();
    } else {
      const posts = await this.readFromJSON();
      
      const newPost = {
        id: Date.now().toString(),
        title: postData.title.trim(),
        description: postData.description?.trim() || '',
        content: postData.content?.trim() || '',
        audioLink: postData.audioLink?.trim() || '',
        pdfLink: postData.pdfLink?.trim() || '',
        quizId: postData.quizId?.trim() || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      posts.push(newPost);
      await this.saveToJSON(posts);
      return newPost;
    }
  }

  async updatePost(id, postData) {
    if (this.useDatabase) {
      let quizId = null;
      
      // Validar quizId se fornecido
      if (postData.quizId && postData.quizId.trim() !== '') {
        const qId = postData.quizId.trim();
        // Verificar se é um ObjectId válido (24 caracteres hexadecimais)
        if (qId.length === 24 && /^[a-fA-F0-9]{24}$/.test(qId)) {
          quizId = qId;
        } else {
          console.warn(`QuizId inválido ignorado: ${qId}`);
        }
      }

      const transformedData = {
        ...postData,
        quizId: quizId,
        updatedAt: new Date()
      };

      return await Post.findByIdAndUpdate(
        id, 
        transformedData,
        { new: true, runValidators: true }
      );
    } else {
      const posts = await this.readFromJSON();
      const postIndex = posts.findIndex(p => p.id === id);
      
      if (postIndex === -1) {
        throw new Error('Post não encontrado');
      }

      posts[postIndex] = {
        ...posts[postIndex],
        title: postData.title.trim(),
        description: postData.description?.trim() || '',
        content: postData.content?.trim() || '',
        audioLink: postData.audioLink?.trim() || '',
        pdfLink: postData.pdfLink?.trim() || '',
        quizId: postData.quizId?.trim() || '',
        updatedAt: new Date().toISOString()
      };

      await this.saveToJSON(posts);
      return posts[postIndex];
    }
  }

  async deletePost(id) {
    if (this.useDatabase) {
      const result = await Post.findByIdAndDelete(id);
      return !!result;
    } else {
      const posts = await this.readFromJSON();
      const filteredPosts = posts.filter(p => p.id !== id);
      
      if (filteredPosts.length === posts.length) {
        return false; // Não encontrou
      }

      await this.saveToJSON(filteredPosts);
      return true;
    }
  }
}

module.exports = new PostService();
