const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  descricao: {
    type: String,
    trim: true,
    default: ''
  },
  materia: {
    type: String,
    trim: true,
    default: ''
  },
  questionIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  }],
  tempoEstimado: {
    type: Number,
    default: 30,
    min: 1,
    max: 180 // máximo 3 horas
  },
  instrucoes: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true // Adiciona createdAt e updatedAt automaticamente
});

// Validação para garantir pelo menos uma questão
quizSchema.pre('save', function(next) {
  if (!this.questionIds || this.questionIds.length === 0) {
    const error = new Error('Deve ter pelo menos uma questão');
    return next(error);
  }
  next();
});

// Índices para otimizar consultas
quizSchema.index({ materia: 1 });
quizSchema.index({ createdAt: -1 });
quizSchema.index({ titulo: 'text', descricao: 'text' }); // Para busca por texto

module.exports = mongoose.model('Quiz', quizSchema);
