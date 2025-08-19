const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const questionService = require('./questionService');
const fs = require('fs').promises;
const path = require('path');

const QUIZZES_FILE = path.join(__dirname, '..', 'quizzes.json');

class QuizService {
  constructor() {
    this.useDatabase = false;
  }

  // Inicializa o serviço e verifica se pode usar MongoDB
  async initialize() {
    try {
      if (Quiz && Quiz.db && Quiz.db.readyState === 1) {
        this.useDatabase = true;
        console.log('📊 QuizService: Usando MongoDB');
        await this.migrateFromJSON();
      } else {
        console.log('📄 QuizService: Usando arquivos JSON');
      }
    } catch (error) {
      console.log('📄 QuizService: Fallback para JSON devido a erro:', error.message);
    }
  }

  // Migra dados do JSON para MongoDB (apenas uma vez)
  async migrateFromJSON() {
    try {
      const count = await Quiz.countDocuments();
      if (count > 0) return; // Já tem dados no banco

      const jsonData = await this.readFromJSON();
      if (jsonData.length === 0) return;

      console.log(`🔄 Migrando ${jsonData.length} questionários do JSON para MongoDB...`);
      
      // Precisa mapear os IDs das questões do JSON para ObjectIds do MongoDB
      const allQuestions = await Question.find().lean();
      
      for (const item of jsonData) {
        // Mapeia questionIds do formato string para ObjectIds
        const mappedQuestionIds = [];
        
        for (const oldQuestionId of item.questionIds) {
          // Busca a questão que tinha esse ID no JSON
          const questions = await questionService.readFromJSON();
          const oldQuestion = questions.find(q => q.id === oldQuestionId);
          
          if (oldQuestion) {
            // Encontra a questão correspondente no MongoDB pelo conteúdo
            const mongoQuestion = allQuestions.find(q => 
              q.enunciado === oldQuestion.enunciado && 
              q.materia === oldQuestion.materia
            );
            
            if (mongoQuestion) {
              mappedQuestionIds.push(mongoQuestion._id);
            }
          }
        }

        if (mappedQuestionIds.length > 0) {
          const quiz = new Quiz({
            titulo: item.titulo,
            descricao: item.descricao,
            materia: item.materia,
            questionIds: mappedQuestionIds,
            tempoEstimado: item.tempoEstimado,
            instrucoes: item.instrucoes
          });
          
          // Preserva as datas originais
          if (item.createdAt) quiz.createdAt = new Date(item.createdAt);
          if (item.updatedAt) quiz.updatedAt = new Date(item.updatedAt);
          
          await quiz.save();
        }
      }
      
      console.log('✅ Migração de questionários concluída!');
    } catch (error) {
      console.error('❌ Erro na migração de questionários:', error);
    }
  }

  // Lê dados do arquivo JSON
  async readFromJSON() {
    try {
      const data = await fs.readFile(QUIZZES_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  // Salva dados no arquivo JSON
  async saveToJSON(quizzes) {
    await fs.writeFile(QUIZZES_FILE, JSON.stringify(quizzes, null, 2));
  }

  // ===== MÉTODOS PÚBLICOS =====

  async getAllQuizzes() {
    if (this.useDatabase) {
      return await Quiz.find()
        .populate('questionIds', 'materia enunciado')
        .sort({ createdAt: -1 })
        .lean();
    } else {
      const quizzes = await this.readFromJSON();
      return quizzes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }

  async getQuizById(id) {
    if (this.useDatabase) {
      const quiz = await Quiz.findById(id).lean();
      
      if (!quiz) return null;
      
      // Buscar questões relacionadas manualmente
      const questions = await Question.find({ 
        _id: { $in: quiz.questionIds } 
      }).lean();
      
      return {
        ...quiz,
        questions: questions // Questões completas para execução
      };
    } else {
      const quizzes = await this.readFromJSON();
      const quiz = quizzes.find(q => q.id === id);
      
      if (!quiz) return null;

      // Buscar as questões do questionário
      const questions = await questionService.getAllQuestions();
      const quizQuestions = questions.filter(q => quiz.questionIds.includes(q.id));
      
      return {
        ...quiz,
        questions: quizQuestions
      };
    }
  }

  async createQuiz(quizData) {
    if (this.useDatabase) {
      // Converte string IDs para ObjectIds e verifica se as questões existem
      const objectIds = quizData.questionIds.map(id => {
        if (typeof id === 'string' && id.length === 24) {
          return id;
        }
        throw new Error(`ID de questão inválido: ${id}`);
      });

      const validQuestions = await Question.find({ 
        _id: { $in: objectIds } 
      });

      if (validQuestions.length !== objectIds.length) {
        console.log('IDs enviados:', objectIds);
        console.log('Questões encontradas:', validQuestions.map(q => q._id));
        throw new Error(`Algumas questões não foram encontradas. Esperadas: ${objectIds.length}, Encontradas: ${validQuestions.length}`);
      }

      const quiz = new Quiz({
        ...quizData,
        questionIds: objectIds
      });
      return await quiz.save();
    } else {
      const quizzes = await this.readFromJSON();
      
      // Verificar se as questões existem
      const questions = await questionService.getAllQuestions();
      const validQuestionIds = quizData.questionIds.filter(id => 
        questions.some(q => q.id === id)
      );

      if (validQuestionIds.length !== quizData.questionIds.length) {
        throw new Error('Algumas questões não foram encontradas');
      }
      
      const newQuiz = {
        id: Date.now().toString(),
        titulo: quizData.titulo.trim(),
        descricao: quizData.descricao?.trim() || '',
        materia: quizData.materia?.trim() || '',
        questionIds: validQuestionIds,
        tempoEstimado: quizData.tempoEstimado || 30,
        instrucoes: quizData.instrucoes?.trim() || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      quizzes.push(newQuiz);
      await this.saveToJSON(quizzes);
      return newQuiz;
    }
  }

  async updateQuiz(id, quizData) {
    if (this.useDatabase) {
      // Converte string IDs para ObjectIds e verifica se as questões existem
      let transformedData = { ...quizData };
      
      if (quizData.questionIds) {
        const objectIds = quizData.questionIds.map(qId => {
          if (typeof qId === 'string' && qId.length === 24) {
            return qId;
          }
          throw new Error(`ID de questão inválido: ${qId}`);
        });

        const validQuestions = await Question.find({ 
          _id: { $in: objectIds } 
        });

        if (validQuestions.length !== objectIds.length) {
          throw new Error('Algumas questões não foram encontradas');
        }

        transformedData.questionIds = objectIds;
      }

      transformedData.updatedAt = new Date();

      return await Quiz.findByIdAndUpdate(
        id, 
        transformedData,
        { new: true, runValidators: true }
      );
    } else {
      const quizzes = await this.readFromJSON();
      const quizIndex = quizzes.findIndex(q => q.id === id);
      
      if (quizIndex === -1) {
        throw new Error('Questionário não encontrado');
      }

      // Verificar se as questões existem
      if (quizData.questionIds) {
        const questions = await questionService.getAllQuestions();
        const validQuestionIds = quizData.questionIds.filter(id => 
          questions.some(q => q.id === id)
        );

        if (validQuestionIds.length !== quizData.questionIds.length) {
          throw new Error('Algumas questões não foram encontradas');
        }
      }

      quizzes[quizIndex] = {
        ...quizzes[quizIndex],
        titulo: quizData.titulo.trim(),
        descricao: quizData.descricao?.trim() || '',
        materia: quizData.materia?.trim() || '',
        questionIds: quizData.questionIds || quizzes[quizIndex].questionIds,
        tempoEstimado: quizData.tempoEstimado || 30,
        instrucoes: quizData.instrucoes?.trim() || '',
        updatedAt: new Date().toISOString()
      };

      await this.saveToJSON(quizzes);
      return quizzes[quizIndex];
    }
  }

  async deleteQuiz(id) {
    if (this.useDatabase) {
      const result = await Quiz.findByIdAndDelete(id);
      return !!result;
    } else {
      const quizzes = await this.readFromJSON();
      const filteredQuizzes = quizzes.filter(q => q.id !== id);
      
      if (filteredQuizzes.length === quizzes.length) {
        return false; // Não encontrou
      }

      await this.saveToJSON(filteredQuizzes);
      return true;
    }
  }
}

module.exports = new QuizService();
