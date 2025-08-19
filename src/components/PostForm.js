import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import './PostForm.css';

const PostForm = ({ post, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    description: post?.description || '',
    content: post?.content || '',
    audioLink: post?.audioLink || '',
    pdfLink: post?.pdfLink || '',
    quizId: post?.quizId || ''
  });

  const [availableQuizzes, setAvailableQuizzes] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      const quizzes = await apiService.fetchQuizzes();
      setAvailableQuizzes(quizzes);
    } catch (error) {
      console.error('Erro ao carregar questionários:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateUrl = (url) => {
    if (!url.trim()) return true; // URL vazia é válida
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Por favor, adicione um título para o post.');
      return;
    }

    // Validar URLs se foram fornecidas
    if (formData.audioLink && !validateUrl(formData.audioLink)) {
      alert('❌ Link do áudio inválido. Por favor, verifique a URL.');
      return;
    }

    if (formData.pdfLink && !validateUrl(formData.pdfLink)) {
      alert('❌ Link do PDF inválido. Por favor, verifique a URL.');
      return;
    }

    onSubmit(formData);
  };



  return (
    <div className="modal-overlay">
      <div className="modal post-form-modal">
        <div className="modal-header">
          <h3>
            {post ? '✏️ Editar Post' : '➕ Novo Post'}
          </h3>
          <button 
            className="close-btn"
            onClick={onClose}
            type="button"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group">
            <label htmlFor="title">📝 Título *</label>
            <input
              type="text"
              id="title"
              name="title"
              className="input"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Ex: Resumo da Semana 10 - React Hooks"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">📋 Descrição</label>
            <input
              type="text"
              id="description"
              name="description"
              className="input"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Breve descrição do conteúdo da semana"
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">📄 Conteúdo do Resumo</label>
            <textarea
              id="content"
              name="content"
              className="textarea"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Digite aqui o resumo detalhado da semana..."
              rows="8"
            />
          </div>

          <div className="links-section">
            <h4>🔗 Links dos Arquivos</h4>
            <div className="links-info">
              <p className="links-description">
                💡 <strong>Faça upload dos seus arquivos em serviços externos</strong> (Google Drive, Dropbox, OneDrive, etc.) e cole os links aqui
              </p>
              <div className="links-tips">
                <small>
                  📌 <strong>Dica:</strong> Certifique-se de que os links sejam públicos para que todos possam acessar
                </small>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="audioLink">🎵 Link do Áudio</label>
              <input
                type="url"
                id="audioLink"
                name="audioLink"
                className="input"
                value={formData.audioLink}
                onChange={handleInputChange}
                placeholder="https://drive.google.com/file/d/... ou outro link do áudio"
              />
              <small className="field-hint">
                ℹ️ Link direto para arquivo de áudio (MP3, WAV, etc.)
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="pdfLink">📄 Link do PDF</label>
              <input
                type="url"
                id="pdfLink"
                name="pdfLink"
                className="input"
                value={formData.pdfLink}
                onChange={handleInputChange}
                placeholder="https://drive.google.com/file/d/... ou outro link do PDF"
              />
              <small className="field-hint">
                ℹ️ Link direto para arquivo PDF com o material de estudo
              </small>
            </div>
          </div>

          <div className="quiz-section">
            <h4>📝 Questionário Relacionado</h4>
            <div className="quiz-info">
              <p className="quiz-description">
                💡 <strong>Vincule um questionário</strong> para que os usuários possam respondê-lo diretamente do post
              </p>
            </div>
            
            <div className="form-group">
              <label htmlFor="quizId">🔗 Selecionar Questionário</label>
              <select
                id="quizId"
                name="quizId"
                className="select"
                value={formData.quizId}
                onChange={handleInputChange}
              >
                <option value="">Nenhum questionário</option>
                {availableQuizzes.map(quiz => {
                  const quizId = quiz._id || quiz.id;
                  return (
                  <option key={quizId} value={quizId}>
                    📝 {quiz.titulo} ({quiz.materia}) - {quiz.questionIds?.length || 0} questões
                  </option>
                )})}
              </select>
              <small className="field-hint">
                ℹ️ Os usuários poderão acessar e responder o questionário diretamente do feed
              </small>
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
            >
              {post ? '💾 Salvar Alterações' : '📤 Publicar Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm;
