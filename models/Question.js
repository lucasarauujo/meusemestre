const mongoose = require('mongoose');

const alternativaSchema = new mongoose.Schema({
  letra: {
    type: String,
    required: true,
    enum: ['A', 'B', 'C', 'D']
  },
  texto: {
    type: String,
    required: true,
    trim: true
  }
});

const feedbackSchema = new mongoose.Schema({
  letra: {
    type: String,
    required: true,
    enum: ['A', 'B', 'C', 'D']
  },
  texto: {
    type: String,
    required: true,
    trim: true
  }
});

const questionSchema = new mongoose.Schema({
  materia: {
    type: String,
    required: true,
    trim: true
  },
  enunciado: {
    type: String,
    required: true,
    trim: true
  },
  alternativas: {
    type: [alternativaSchema],
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length === 4;
      },
      message: 'Deve ter exatamente 4 alternativas'
    }
  },
  correta: {
    type: String,
    required: true,
    enum: ['A', 'B', 'C', 'D']
  },
  feedbacks: {
    type: [feedbackSchema],
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length === 4;
      },
      message: 'Deve ter feedbacks para as 4 alternativas'
    }
  },
  dica: {
    type: String,
    required: true,
    trim: true
  },
  explicacao: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true // Adiciona createdAt e updatedAt automaticamente
});

// Índices para otimizar consultas
questionSchema.index({ materia: 1 });
questionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Question', questionSchema);
