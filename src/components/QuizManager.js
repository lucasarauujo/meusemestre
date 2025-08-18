import React, { useState, useEffect } from 'react';
import QuizForm from './QuizForm';
import apiService from '../services/apiService';
import './QuizManager.css';

const QuizManager = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [filterMateria, setFilterMateria] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [quizzesData, questionsData] = await Promise.all([
        apiService.fetchQuizzes(),
        apiService.fetchQuestions()
      ]);
      
      setQuizzes(quizzesData);
      setQuestions(questionsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Falha ao carregar dados. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = async (quizData) => {
    try {
      const newQuiz = await apiService.createQuiz(quizData);
      setQuizzes(prev => [newQuiz, ...prev]);
      setShowForm(false);
      setEditingQuiz(null);
      alert('✅ Questionário criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar questionário:', error);
      alert(`❌ Erro ao criar questionário: ${error.message}`);
    }
  };

  const handleEditQuiz = async (quizData) => {
    try {
      const updatedQuiz = await apiService.updateQuiz(editingQuiz.id, quizData);
      setQuizzes(prev => prev.map(q => q.id === editingQuiz.id ? updatedQuiz : q));
      setShowForm(false);
      setEditingQuiz(null);
      alert('✅ Questionário atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar questionário:', error);
      alert(`❌ Erro ao atualizar questionário: ${error.message}`);
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm('Tem certeza que deseja excluir este questionário?')) {
      return;
    }

    try {
      await apiService.deleteQuiz(quizId);
      setQuizzes(prev => prev.filter(q => q.id !== quizId));
      alert('✅ Questionário excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar questionário:', error);
      alert(`❌ Erro ao excluir questionário: ${error.message}`);
    }
  };

  const startEdit = (quiz) => {
    setEditingQuiz(quiz);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingQuiz(null);
  };

  const getFilteredQuizzes = () => {
    if (!filterMateria) return quizzes;
    return quizzes.filter(quiz => 
      quiz.materia.toLowerCase().includes(filterMateria.toLowerCase())
    );
  };

  const getMaterias = () => {
    const materias = [...new Set(quizzes.map(q => q.materia).filter(Boolean))];
    return materias.sort();
  };

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

  const getQuestionsCount = (quiz) => {
    return quiz.questionIds?.length || 0;
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-icon">⏳</div>
        <h3>Carregando questionários...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <div className="error-icon">❌</div>
        <h3>Erro ao carregar dados</h3>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadData}>
          🔄 Tentar Novamente
        </button>
      </div>
    );
  }

  const filteredQuizzes = getFilteredQuizzes();

  return (
    <div className="quiz-manager">
      <div className="manager-header">
        <div className="manager-title">
          <h3>📝 Gerenciar Questionários</h3>
          <p>Crie e gerencie questionários com as questões cadastradas</p>
        </div>
        
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          📝 Novo Questionário
        </button>
      </div>

      <div className="manager-controls">
        <div className="filter-section">
          <label htmlFor="filterMateria">🔍 Filtrar por Matéria:</label>
          <select
            id="filterMateria"
            value={filterMateria}
            onChange={(e) => setFilterMateria(e.target.value)}
            className="select"
          >
            <option value="">Todas as matérias</option>
            {getMaterias().map(materia => (
              <option key={materia} value={materia}>{materia}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <span className="stat-number">{quizzes.length}</span>
            <span className="stat-label">Questionários</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">❓</div>
          <div className="stat-info">
            <span className="stat-number">{questions.length}</span>
            <span className="stat-label">Questões Disponíveis</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <span className="stat-number">
              {quizzes.reduce((total, quiz) => total + getQuestionsCount(quiz), 0)}
            </span>
            <span className="stat-label">Total de Questões</span>
          </div>
        </div>
      </div>

      <div className="quizzes-section">
        <h4>📋 Questionários Criados</h4>
        
        {filteredQuizzes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h4>Nenhum questionário encontrado</h4>
            <p>
              {quizzes.length === 0 
                ? 'Clique em "Novo Questionário" para começar a criar questionários com as questões cadastradas.'
                : 'Nenhum questionário corresponde ao filtro selecionado.'
              }
            </p>
          </div>
        ) : (
          <div className="quizzes-grid">
            {filteredQuizzes.map(quiz => (
              <div key={quiz.id} className="quiz-card">
                <div className="quiz-header">
                  <h5 className="quiz-title">{quiz.titulo}</h5>
                  <div className="quiz-meta">
                    <span className="quiz-materia">📚 {quiz.materia || 'Sem matéria'}</span>
                    <span className="quiz-questions">❓ {getQuestionsCount(quiz)} questões</span>
                  </div>
                </div>
                
                {quiz.descricao && (
                  <p className="quiz-description">{quiz.descricao}</p>
                )}
                
                <div className="quiz-details">
                  <span className="quiz-time">⏱️ {quiz.tempoEstimado} min</span>
                  <span className="quiz-date">📅 {formatDate(quiz.createdAt)}</span>
                </div>
                
                {quiz.instrucoes && (
                  <div className="quiz-instructions">
                    <strong>📋 Instruções:</strong> {quiz.instrucoes}
                  </div>
                )}
                
                <div className="quiz-actions">
                  <button 
                    className="btn btn-sm"
                    onClick={() => startEdit(quiz)}
                  >
                    ✏️ Editar
                  </button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteQuiz(quiz.id)}
                  >
                    🗑️ Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <QuizForm
          quiz={editingQuiz}
          onSubmit={editingQuiz ? handleEditQuiz : handleCreateQuiz}
          onClose={closeForm}
        />
      )}
    </div>
  );
};

export default QuizManager;
