import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import './QuizForm.css';

const QuizForm = ({ quiz, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    titulo: quiz?.titulo || '',
    descricao: quiz?.descricao || '',
    materia: quiz?.materia || '',
    questionIds: quiz?.questionIds || [],
    tempoEstimado: quiz?.tempoEstimado || 30,
    instrucoes: quiz?.instrucoes || ''
  });

  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const questions = await apiService.fetchQuestions();
      setAvailableQuestions(questions);
    } catch (error) {
      console.error('Erro ao carregar questões:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro do campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleQuestionToggle = (questionId) => {
    // Normalizar ID (MongoDB usa _id, JSON usa id)
    const normalizedQuestionId = questionId._id || questionId.id || questionId;
    
    setFormData(prev => ({
      ...prev,
      questionIds: prev.questionIds.includes(normalizedQuestionId)
        ? prev.questionIds.filter(id => id !== normalizedQuestionId)
        : [...prev.questionIds, normalizedQuestionId]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'Título é obrigatório';
    }

    if (formData.questionIds.length === 0) {
      newErrors.questionIds = 'Selecione pelo menos uma questão';
    }

    if (formData.tempoEstimado < 1) {
      newErrors.tempoEstimado = 'Tempo estimado deve ser maior que 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  const getMaterias = () => {
    const materias = [...new Set(availableQuestions.map(q => q.materia))];
    return materias.sort();
  };

  const getQuestionsByMateria = (materia) => {
    return availableQuestions.filter(q => q.materia === materia);
  };

  const isQuestionSelected = (questionId) => {
    // Normalizar IDs para comparação (MongoDB usa _id, JSON usa id)
    const normalizedQuestionId = questionId._id || questionId.id || questionId;
    return formData.questionIds.includes(normalizedQuestionId);
  };

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal quiz-form-modal">
          <div className="loading-state">
            <div className="loading-icon">⏳</div>
            <h3>Carregando questões...</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal quiz-form-modal">
        <div className="modal-header">
          <h3>
            {quiz ? '✏️ Editar Questionário' : '📝 Novo Questionário'}
          </h3>
          <button 
            className="close-btn"
            onClick={onClose}
            type="button"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="quiz-form">
          <div className="form-group">
            <label htmlFor="titulo">📝 Título do Questionário *</label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              className={`input ${errors.titulo ? 'error' : ''}`}
              value={formData.titulo}
              onChange={handleInputChange}
              placeholder="Ex: Avaliação de Matemática - Capítulo 1"
              required
            />
            {errors.titulo && <span className="error-message">{errors.titulo}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="descricao">📖 Descrição</label>
            <textarea
              id="descricao"
              name="descricao"
              className="textarea"
              value={formData.descricao}
              onChange={handleInputChange}
              placeholder="Descreva o conteúdo e objetivo do questionário..."
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="materia">📚 Matéria Principal</label>
            <select
              id="materia"
              name="materia"
              className="select"
              value={formData.materia}
              onChange={handleInputChange}
            >
              <option value="">Selecione uma matéria</option>
              {getMaterias().map(materia => (
                <option key={materia} value={materia}>{materia}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="tempoEstimado">⏱️ Tempo Estimado (minutos) *</label>
            <input
              type="number"
              id="tempoEstimado"
              name="tempoEstimado"
              className={`input ${errors.tempoEstimado ? 'error' : ''}`}
              value={formData.tempoEstimado}
              onChange={handleInputChange}
              min="1"
              max="180"
              required
            />
            {errors.tempoEstimado && <span className="error-message">{errors.tempoEstimado}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="instrucoes">📋 Instruções</label>
            <textarea
              id="instrucoes"
              name="instrucoes"
              className="textarea"
              value={formData.instrucoes}
              onChange={handleInputChange}
              placeholder="Instruções específicas para os alunos..."
              rows="3"
            />
          </div>

          <div className="questions-selection">
            <h4>❓ Selecionar Questões *</h4>
            <p className="selection-info">
              Selecione as questões que farão parte deste questionário:
            </p>
            
            {errors.questionIds && (
              <span className="error-message">{errors.questionIds}</span>
            )}

            <div className="questions-by-materia">
              {getMaterias().map(materia => {
                const questions = getQuestionsByMateria(materia);
                if (questions.length === 0) return null;

                return (
                  <div key={materia} className="materia-section">
                    <h5 className="materia-title">📚 {materia}</h5>
                    <div className="questions-list">
                      {questions.map(question => {
                        const questionId = question._id || question.id;
                        return (
                        <div 
                          key={questionId} 
                          className={`question-item ${isQuestionSelected(questionId) ? 'selected' : ''}`}
                          onClick={() => handleQuestionToggle(questionId)}
                        >
                          <input
                            type="checkbox"
                            checked={isQuestionSelected(questionId)}
                            onChange={() => handleQuestionToggle(questionId)}
                            className="question-checkbox"
                          />
                          <div className="question-content">
                            <span className="question-enunciado">
                              {question.enunciado.length > 80 
                                ? `${question.enunciado.substring(0, 80)}...`
                                : question.enunciado
                              }
                            </span>
                            <span className="question-meta">
                              {question.alternativas.length} alternativas • {question.materia}
                            </span>
                          </div>
                        </div>
                      )})}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="selection-summary">
              <span className="selected-count">
                ✅ {formData.questionIds.length} questão(ões) selecionada(s)
              </span>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn"
              onClick={onClose}
            >
              ❌ Cancelar
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={formData.questionIds.length === 0}
            >
              {quiz ? '💾 Salvar Alterações' : '📤 Criar Questionário'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizForm;
