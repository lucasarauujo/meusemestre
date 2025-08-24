const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  content: {
    type: String,
    trim: true,
    default: ''
  },
  audioLink: {
    type: String,
    trim: true,
    default: ''
  },
  pdfLink: {
    type: String,
    trim: true,
    default: ''
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    default: null
  },
  materia: {
    type: String,
    trim: true,
    default: 'Geral' // Para compatibilidade com posts existentes
  }
}, {
  timestamps: true // Adiciona createdAt e updatedAt automaticamente
});

// Índices para otimizar consultas
postSchema.index({ createdAt: -1 });
postSchema.index({ materia: 1, createdAt: -1 }); // Para filtragem por matéria
postSchema.index({ title: 'text', description: 'text', content: 'text' }); // Para busca por texto

module.exports = mongoose.model('Post', postSchema);
