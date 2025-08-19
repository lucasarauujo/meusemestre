import React, { useState } from 'react';
import QuizExecutor from './QuizExecutor';
import apiService from '../services/apiService';
import './Feed.css';

const Feed = ({ posts }) => {
  const [executingQuiz, setExecutingQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getWeekNumber = (date) => {
    const d = new Date(date);
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const today = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const dayOfYear = ((today - yearStart + 86400000) / 86400000);
    return Math.ceil(dayOfYear / 7);
  };

  const handleOpenLink = (url, type) => {
    if (!url || !url.trim()) {
      alert(`❌ Link do ${type} não disponível`);
      return;
    }
    
    try {
      // Validar se é uma URL válida
      new URL(url);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      alert(`❌ Link do ${type} inválido`);
    }
  };

  const handleStartQuiz = async (quizId) => {
    try {
      // Garantir que quizId é uma string válida
      const id = String(quizId).trim();
      if (!id) {
        throw new Error('ID do questionário inválido');
      }
      
      const quiz = await apiService.fetchQuizById(id);
      setCurrentQuiz(quiz);
      setExecutingQuiz(true);
    } catch (error) {
      console.error('Erro ao carregar questionário:', error);
      alert('❌ Erro ao carregar questionário. Tente novamente.');
    }
  };

  const handleCloseQuiz = () => {
    setExecutingQuiz(false);
    setCurrentQuiz(null);
  };



  return (
    <main className="feed">
      <div className="container">
        <div className="feed-header">
          <h2>📋 Feed dos Resumos</h2>
          <p>Acompanhe os resumos semanais e materiais de estudo</p>
        </div>

        {posts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>Ainda não há posts</h3>
            <p>Os resumos semanais aparecerão aqui quando forem adicionados.</p>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map(post => (
              <article key={post.id} className="post-card fade-in">
                <div className="post-header">
                  <div className="post-meta">
                    <span className="week-badge">
                      📅 Semana {getWeekNumber(post.createdAt)}
                    </span>
                    <span className="post-date">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="post-content">
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-description">{post.description}</p>

                  {post.content && (
                    <div className="post-text">
                      <h4>📝 Resumo</h4>
                      <div className="content-text">
                        {post.content.split('\n').map((line, index) => (
                          <p key={index}>{line}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {(post.audioLink || post.pdfLink) && (
                    <div className="post-attachments">
                      <h4>🔗 Links dos Arquivos</h4>
                      <div className="attachments-list">
                        {post.audioLink && (
                          <div className="attachment">
                            <div className="attachment-info">
                              <span className="attachment-icon">🎵</span>
                              <div className="attachment-details">
                                <span className="attachment-name">Arquivo de Áudio</span>
                                <div className="attachment-meta">
                                  <span className="attachment-url">
                                    {post.audioLink.length > 50 
                                      ? `${post.audioLink.substring(0, 47)}...`
                                      : post.audioLink
                                    }
                                  </span>
                                </div>
                              </div>
                            </div>
                            <button
                              className="download-btn"
                              onClick={() => handleOpenLink(post.audioLink, 'áudio')}
                              title="Abrir link do áudio"
                            >
                              🔗 Abrir
                            </button>
                          </div>
                        )}
                        {post.pdfLink && (
                          <div className="attachment">
                            <div className="attachment-info">
                              <span className="attachment-icon">📄</span>
                              <div className="attachment-details">
                                <span className="attachment-name">Arquivo PDF</span>
                                <div className="attachment-meta">
                                  <span className="attachment-url">
                                    {post.pdfLink.length > 50 
                                      ? `${post.pdfLink.substring(0, 47)}...`
                                      : post.pdfLink
                                    }
                                  </span>
                                </div>
                              </div>
                            </div>
                            <button
                              className="download-btn"
                              onClick={() => handleOpenLink(post.pdfLink, 'PDF')}
                              title="Abrir link do PDF"
                            >
                              🔗 Abrir
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}


                  
                  {post.quizId && post.quizId !== null && String(post.quizId).trim() !== '' ? (
                    <div className="post-quiz">
                      <h4>📝 Questionário Disponível</h4>
                      <div className="quiz-info">
                        <p className="quiz-description">
                          💡 <strong>Teste seus conhecimentos</strong> respondendo ao questionário relacionado a este post
                        </p>
                        <button
                          className="quiz-btn"
                          onClick={() => handleStartQuiz(post.quizId)}
                          title="Iniciar questionário"
                        >
                          🚀 Iniciar Questionário
                        </button>
                      </div>
                    </div>
                  ) : null}
                  

                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {executingQuiz && currentQuiz && (
        <QuizExecutor
          quiz={currentQuiz}
          onClose={handleCloseQuiz}
        />
      )}
    </main>
  );
};

export default Feed;
