import React, { useState } from 'react';
import './QuestionForm.css';

const QuestionForm = ({ question, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    materia: question?.materia || '',
    enunciado: question?.enunciado || '',
    alternativas: question?.alternativas?.map(alt => alt.texto) || ['', '', '', ''],
    correta: question?.correta || 'A',
    feedbacks: question?.feedbacks?.map(fb => fb.texto) || ['', '', '', ''],
    dica: question?.dica || '',
    explicacao: question?.explicacao || ''
  });

  const [errors, setErrors] = useState({});

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

  const handleAlternativaChange = (index, value) => {
    const newAlternativas = [...formData.alternativas];
    newAlternativas[index] = value;
    setFormData(prev => ({
      ...prev,
      alternativas: newAlternativas
    }));
    
    // Limpar erro
    if (errors[`alternativa_${index}`]) {
      setErrors(prev => ({ ...prev, [`alternativa_${index}`]: '' }));
    }
  };

  const handleFeedbackChange = (index, value) => {
    const newFeedbacks = [...formData.feedbacks];
    newFeedbacks[index] = value;
    setFormData(prev => ({
      ...prev,
      feedbacks: newFeedbacks
    }));
    
    // Limpar erro
    if (errors[`feedback_${index}`]) {
      setErrors(prev => ({ ...prev, [`feedback_${index}`]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.materia.trim()) {
      newErrors.materia = 'Matéria é obrigatória';
    }

    if (!formData.enunciado.trim()) {
      newErrors.enunciado = 'Enunciado é obrigatório';
    }

    formData.alternativas.forEach((alt, index) => {
      if (!alt.trim()) {
        newErrors[`alternativa_${index}`] = `Alternativa ${String.fromCharCode(65 + index)} é obrigatória`;
      }
    });

    formData.feedbacks.forEach((fb, index) => {
      if (!fb.trim()) {
        newErrors[`feedback_${index}`] = `Feedback da alternativa ${String.fromCharCode(65 + index)} é obrigatório`;
      }
    });

    if (!formData.dica.trim()) {
      newErrors.dica = 'Dica é obrigatória';
    }

    if (!formData.explicacao.trim()) {
      newErrors.explicacao = 'Explicação é obrigatória';
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
    return [
      'Psicologia Infantil',
      'Técnicas de Avaliação Psicológica IV',
      'Psicossomática',
      'Psicofarmacologia',
      'Neurociência',
      'Ética Profissional',
      'Estágio II: Saúde Mental',
      'Outra'
    ];
  };

  return (
    <div className="modal-overlay">
      <div className="modal question-form-modal">
        <div className="modal-header">
          <h3>
            {question ? '✏️ Editar Questão' : '➕ Nova Questão'}
          </h3>
          <button 
            className="close-btn"
            onClick={onClose}
            type="button"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="question-form">
          <div className="form-group">
            <label htmlFor="materia">📚 Matéria *</label>
            <select
              id="materia"
              name="materia"
              className={`select ${errors.materia ? 'error' : ''}`}
              value={formData.materia}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecione uma matéria</option>
              {getMaterias().map(materia => (
                <option key={materia} value={materia}>{materia}</option>
              ))}
            </select>
            {errors.materia && <span className="error-message">{errors.materia}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="enunciado">📝 Enunciado *</label>
            <textarea
              id="enunciado"
              name="enunciado"
              className={`textarea ${errors.enunciado ? 'error' : ''}`}
              value={formData.enunciado}
              onChange={handleInputChange}
              placeholder="Digite o enunciado da questão de forma clara e objetiva..."
              rows="4"
              required
            />
            {errors.enunciado && <span className="error-message">{errors.enunciado}</span>}
          </div>

          <div className="alternativas-section">
            <h4>🔤 Alternativas (exatamente 4)</h4>
            {formData.alternativas.map((alternativa, index) => (
              <div key={index} className="form-group alternativa-group">
                <label htmlFor={`alternativa_${index}`}>
                  {String.fromCharCode(65 + index)}) *
                </label>
                <input
                  type="text"
                  id={`alternativa_${index}`}
                  className={`input ${errors[`alternativa_${index}`] ? 'error' : ''}`}
                  value={alternativa}
                  onChange={(e) => handleAlternativaChange(index, e.target.value)}
                  placeholder={`Texto da alternativa ${String.fromCharCode(65 + index)}`}
                  required
                />
                {errors[`alternativa_${index}`] && (
                  <span className="error-message">{errors[`alternativa_${index}`]}</span>
                )}
              </div>
            ))}
          </div>

          <div className="form-group">
            <label htmlFor="correta">✅ Alternativa Correta *</label>
            <select
              id="correta"
              name="correta"
              className="select"
              value={formData.correta}
              onChange={handleInputChange}
              required
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>

          <div className="feedbacks-section">
            <h4>💬 Feedbacks das Alternativas</h4>
            {formData.feedbacks.map((feedback, index) => (
              <div key={index} className="form-group feedback-group">
                <label htmlFor={`feedback_${index}`}>
                  Feedback {String.fromCharCode(65 + index)}) *
                </label>
                <textarea
                  id={`feedback_${index}`}
                  className={`textarea ${errors[`feedback_${index}`] ? 'error' : ''}`}
                  value={feedback}
                  onChange={(e) => handleFeedbackChange(index, e.target.value)}
                  placeholder={`Explicação sobre a alternativa ${String.fromCharCode(65 + index)}`}
                  rows="2"
                  required
                />
                {errors[`feedback_${index}`] && (
                  <span className="error-message">{errors[`feedback_${index}`]}</span>
                )}
              </div>
            ))}
          </div>

          <div className="form-group">
            <label htmlFor="dica">💡 Dica *</label>
            <input
              type="text"
              id="dica"
              name="dica"
              className={`input ${errors.dica ? 'error' : ''}`}
              value={formData.dica}
              onChange={handleInputChange}
              placeholder="Dica curta para ajudar na resolução"
              required
            />
            {errors.dica && <span className="error-message">{errors.dica}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="explicacao">📖 Explicação Completa *</label>
            <textarea
              id="explicacao"
              name="explicacao"
              className={`textarea ${errors.explicacao ? 'error' : ''}`}
              value={formData.explicacao}
              onChange={handleInputChange}
              placeholder="Explicação completa justificando a resposta correta e por que as outras estão erradas..."
              rows="4"
              required
            />
            {errors.explicacao && <span className="error-message">{errors.explicacao}</span>}
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
            >
              {question ? '💾 Salvar Alterações' : '📤 Criar Questão'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionForm;
