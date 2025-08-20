const Question = require('../models/Question');
const fs = require('fs').promises;
const path = require('path');

const QUESTIONS_FILE = path.join(__dirname, '..', 'questions.json');

class QuestionService {
  constructor() {
    this.useDatabase = false;
  }

  // Inicializa o serviço e verifica se pode usar MongoDB
  async initialize() {
    try {
      if (Question && Question.db && Question.db.readyState === 1) {
        this.useDatabase = true;
        console.log('📊 QuestionService: Usando MongoDB');
        await this.migrateFromJSON();
      } else {
        console.log('📄 QuestionService: Usando arquivos JSON');
      }
    } catch (error) {
      console.log('📄 QuestionService: Fallback para JSON devido a erro:', error.message);
    }
  }

  // Migra dados do JSON para MongoDB (apenas uma vez)
  async migrateFromJSON() {
    try {
      const count = await Question.countDocuments();
      if (count > 0) return; // Já tem dados no banco

      const jsonData = await this.readFromJSON();
      if (jsonData.length === 0) return;

      console.log(`🔄 Migrando ${jsonData.length} questões do JSON para MongoDB...`);
      
      for (const item of jsonData) {
        const question = new Question({
          materia: item.materia,
          enunciado: item.enunciado,
          alternativas: item.alternativas,
          correta: item.correta,
          feedbacks: item.feedbacks,
          dica: item.dica,
          explicacao: item.explicacao
        });
        
        // Preserva as datas originais
        if (item.createdAt) question.createdAt = new Date(item.createdAt);
        if (item.updatedAt) question.updatedAt = new Date(item.updatedAt);
        
        await question.save();
      }
      
      console.log('✅ Migração de questões concluída!');
    } catch (error) {
      console.error('❌ Erro na migração de questões:', error);
    }
  }

  // Lê dados do arquivo JSON
  async readFromJSON() {
    try {
      const data = await fs.readFile(QUESTIONS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  // Salva dados no arquivo JSON
  async saveToJSON(questions) {
    await fs.writeFile(QUESTIONS_FILE, JSON.stringify(questions, null, 2));
  }

  // ===== MÉTODOS PÚBLICOS =====

  async getAllQuestions() {
    if (this.useDatabase) {
      const questions = await Question.find()
        .sort({ materia: 1, createdAt: -1 })
        .lean();
      
      // Transformar para garantir que id seja sempre uma string
      return questions.map(question => ({
        ...question,
        id: question._id.toString(),
        _id: question._id.toString()
      }));
    } else {
      const questions = await this.readFromJSON();
      return questions.sort((a, b) => {
        if (a.materia !== b.materia) {
          return a.materia.localeCompare(b.materia);
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    }
  }

  async getQuestionsByMateria(materia) {
    if (this.useDatabase) {
      const questions = await Question.find({ 
        materia: new RegExp(materia, 'i') 
      }).lean();
      
      // Transformar para garantir que id seja sempre uma string
      return questions.map(question => ({
        ...question,
        id: question._id.toString(),
        _id: question._id.toString()
      }));
    } else {
      const questions = await this.readFromJSON();
      return questions.filter(q => 
        q.materia.toLowerCase() === materia.toLowerCase()
      );
    }
  }

  async createQuestion(questionData) {
    if (this.useDatabase) {
      // Transformar dados do frontend para o formato do MongoDB
      const transformedData = {
        ...questionData,
        alternativas: questionData.alternativas.map((texto, index) => ({
          letra: String.fromCharCode(65 + index), // A, B, C, D
          texto: texto.trim()
        })),
        feedbacks: questionData.feedbacks.map((texto, index) => ({
          letra: String.fromCharCode(65 + index), // A, B, C, D
          texto: texto.trim()
        }))
      };

      const question = new Question(transformedData);
      const savedQuestion = await question.save();
      
      // Retornar com IDs como strings para consistência
      return {
        ...savedQuestion.toObject(),
        id: savedQuestion._id.toString(),
        _id: savedQuestion._id.toString()
      };
    } else {
      const questions = await this.readFromJSON();
      
      const newQuestion = {
        id: Date.now().toString(),
        materia: questionData.materia.trim(),
        enunciado: questionData.enunciado.trim(),
        alternativas: questionData.alternativas.map((alt, index) => ({
          letra: String.fromCharCode(65 + index),
          texto: alt.trim()
        })),
        correta: questionData.correta.toUpperCase(),
        feedbacks: questionData.feedbacks.map((feedback, index) => ({
          letra: String.fromCharCode(65 + index),
          texto: feedback.trim()
        })),
        dica: questionData.dica.trim(),
        explicacao: questionData.explicacao.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      questions.push(newQuestion);
      await this.saveToJSON(questions);
      return newQuestion;
    }
  }

  async updateQuestion(id, questionData) {
    if (this.useDatabase) {
      // Transformar dados do frontend para o formato do MongoDB
      const transformedData = {
        ...questionData,
        alternativas: questionData.alternativas.map((texto, index) => ({
          letra: String.fromCharCode(65 + index), // A, B, C, D
          texto: texto.trim()
        })),
        feedbacks: questionData.feedbacks.map((texto, index) => ({
          letra: String.fromCharCode(65 + index), // A, B, C, D
          texto: texto.trim()
        })),
        updatedAt: new Date()
      };

      const updatedQuestion = await Question.findByIdAndUpdate(
        id, 
        transformedData,
        { new: true, runValidators: true }
      );
      
      if (!updatedQuestion) return null;
      
      // Retornar com IDs como strings para consistência
      return {
        ...updatedQuestion.toObject(),
        id: updatedQuestion._id.toString(),
        _id: updatedQuestion._id.toString()
      };
    } else {
      const questions = await this.readFromJSON();
      const questionIndex = questions.findIndex(q => q.id === id);
      
      if (questionIndex === -1) {
        throw new Error('Questão não encontrada');
      }

      questions[questionIndex] = {
        ...questions[questionIndex],
        materia: questionData.materia.trim(),
        enunciado: questionData.enunciado.trim(),
        alternativas: questionData.alternativas.map((alt, index) => ({
          letra: String.fromCharCode(65 + index),
          texto: alt.trim()
        })),
        correta: questionData.correta.toUpperCase(),
        feedbacks: questionData.feedbacks.map((feedback, index) => ({
          letra: String.fromCharCode(65 + index),
          texto: feedback.trim()
        })),
        dica: questionData.dica.trim(),
        explicacao: questionData.explicacao.trim(),
        updatedAt: new Date().toISOString()
      };

      await this.saveToJSON(questions);
      return questions[questionIndex];
    }
  }

  async deleteQuestion(id) {
    if (this.useDatabase) {
      // Validar se o ID é válido
      if (!id || id === 'undefined' || typeof id !== 'string' || id.trim() === '') {
        console.error('ID inválido para exclusão:', { id, type: typeof id });
        return false;
      }
      
      // Verificar se é um ObjectId válido
      const cleanId = id.trim();
      if (cleanId.length !== 24 || !/^[a-fA-F0-9]{24}$/.test(cleanId)) {
        console.error('ObjectId inválido para exclusão:', { id: cleanId });
        return false;
      }
      
      const result = await Question.findByIdAndDelete(cleanId);
      return !!result;
    } else {
      const questions = await this.readFromJSON();
      const filteredQuestions = questions.filter(q => q.id !== id);
      
      if (filteredQuestions.length === questions.length) {
        return false; // Não encontrou
      }

      await this.saveToJSON(filteredQuestions);
      return true;
    }
  }
}

module.exports = new QuestionService();
