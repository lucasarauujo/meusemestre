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

  // Força re-migração (para corrigir dados corrompidos)
  async forceMigration() {
    if (!this.useDatabase) return;
    
    try {
      console.log('🔄 Forçando re-migração dos posts...');
      
      // Limpar posts existentes
      await Post.deleteMany({});
      
      // Re-migrar
      await this.migrateFromJSON();
      
      console.log('✅ Re-migração de posts concluída!');
    } catch (error) {
      console.error('❌ Erro na re-migração:', error);
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
      
      // Primeiro, obter o mapeamento de IDs de quiz do JSON para MongoDB
      const Quiz = require('../models/Quiz');
      const allQuizzes = await Quiz.find().lean();
      const quizService = require('./quizService');
      const jsonQuizzes = await quizService.readFromJSON();
      
      // Criar mapeamento de ID JSON -> ObjectId MongoDB
      const quizIdMapping = {};
      for (const jsonQuiz of jsonQuizzes) {
        // Encontrar o quiz correspondente no MongoDB pelo título e matéria
        const mongoQuiz = allQuizzes.find(q => 
          q.titulo === jsonQuiz.titulo && 
          q.materia === jsonQuiz.materia
        );
        if (mongoQuiz) {
          quizIdMapping[jsonQuiz.id] = mongoQuiz._id.toString();
        }
      }
      
      console.log('Mapeamento de Quiz IDs:', quizIdMapping);
      
      for (const item of jsonData) {
        // Mapear quizId do JSON para ObjectId do MongoDB
        let quizId = null;
        if (item.quizId && item.quizId.trim() !== '') {
          const jsonQuizId = item.quizId.trim();
          
          if (quizIdMapping[jsonQuizId]) {
            quizId = quizIdMapping[jsonQuizId];
            console.log(`Mapeando quizId: ${jsonQuizId} -> ${quizId}`);
          } else if (jsonQuizId.length === 24 && /^[a-fA-F0-9]{24}$/.test(jsonQuizId)) {
            // Já é um ObjectId válido
            quizId = jsonQuizId;
          } else {
            console.warn(`QuizId do JSON não encontrado no mapeamento: ${jsonQuizId}`);
          }
        }
        
        const post = new Post({
          title: item.title,
          description: item.description,
          content: item.content,
          audioLink: item.audioLink,
          pdfLink: item.pdfLink,
          quizId: quizId
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
      const posts = await Post.find()
        .populate('quizId', 'titulo descricao')
        .sort({ createdAt: -1 })
        .lean();
      
      // Transformar o resultado para garantir que quizId seja sempre uma string
      return posts.map(post => ({
        ...post,
        id: post._id.toString(),
        quizId: post.quizId ? (post.quizId._id || post.quizId).toString() : null
      }));
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
      const savedPost = await post.save();
      
      // Retornar com IDs como strings para consistência
      return {
        ...savedPost.toObject(),
        id: savedPost._id.toString(),
        quizId: savedPost.quizId ? savedPost.quizId.toString() : null
      };
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

      const updatedPost = await Post.findByIdAndUpdate(
        id, 
        transformedData,
        { new: true, runValidators: true }
      );
      
      if (!updatedPost) return null;
      
      // Retornar com IDs como strings para consistência
      return {
        ...updatedPost.toObject(),
        id: updatedPost._id.toString(),
        quizId: updatedPost.quizId ? updatedPost.quizId.toString() : null
      };
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
