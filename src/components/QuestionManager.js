import React, { useState, useEffect } from 'react';
import QuestionForm from './QuestionForm';
import apiService from '../services/apiService';
import './QuestionManager.css';

const QuestionManager = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [filterMateria, setFilterMateria] = useState('');

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedQuestions = await apiService.fetchQuestions();
      setQuestions(fetchedQuestions);
    } catch (error) {
      console.error('Erro ao carregar questões:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async (questionData) => {
    try {
      const newQuestion = await apiService.createQuestion(questionData);
      setQuestions([newQuestion, ...questions]);
      setShowForm(false);
      alert('✅ Questão criada com sucesso!');
    } catch (error) {
      alert(`❌ Erro ao criar questão: ${error.message}`);
    }
  };

  const handleEditQuestion = async (questionData) => {
    try {
      const updatedQuestion = await apiService.updateQuestion(editingQuestion.id, questionData);
      setQuestions(questions.map(q => q.id === editingQuestion.id ? updatedQuestion : q));
      setEditingQuestion(null);
      setShowForm(false);
      alert('✅ Questão atualizada com sucesso!');
    } catch (error) {
      alert(`❌ Erro ao atualizar questão: ${error.message}`);
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (window.confirm('🗑️ Tem certeza que deseja deletar esta questão?\n\nEsta ação não pode ser desfeita!')) {
      try {
        await apiService.deleteQuestion(id);
        setQuestions(questions.filter(q => q.id !== id));
        alert('✅ Questão deletada com sucesso!');
      } catch (error) {
        alert(`❌ Erro ao deletar questão: ${error.message}`);
      }
    }
  };

  const startEdit = (question) => {
    setEditingQuestion(question);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingQuestion(null);
  };

  const getMaterias = () => {
    const materias = [...new Set(questions.map(q => q.materia))];
    return materias.sort();
  };

  const filteredQuestions = filterMateria 
    ? questions.filter(q => q.materia === filterMateria)
    : questions;

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-icon">⏳</div>
        <h3>Carregando questões...</h3>
        <p>Aguarde um momento</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <div className="error-icon">❌</div>
        <h3>Erro ao carregar questões</h3>
        <p>{error}</p>
        <button className="btn" onClick={loadQuestions}>
          🔄 Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="question-manager">
      <div className="manager-header">
        <h2>❓ Gerenciador de Questões</h2>
        <p>Cadastre e gerencie questões para os questionários</p>
      </div>

      <div className="manager-controls">
        <div className="filter-section">
          <label htmlFor="filterMateria">📚 Filtrar por Matéria:</label>
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

        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          ➕ Nova Questão
        </button>
      </div>

      <div className="questions-stats">
        <div className="stat-card">
          <span className="stat-icon">📊</span>
          <div className="stat-info">
            <span className="stat-number">{questions.length}</span>
            <span className="stat-label">Total de Questões</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📚</span>
          <div className="stat-info">
            <span className="stat-number">{getMaterias().length}</span>
            <span className="stat-label">Matérias</span>
          </div>
        </div>
        {filterMateria && (
          <div className="stat-card">
            <span className="stat-icon">🔍</span>
            <div className="stat-info">
              <span className="stat-number">{filteredQuestions.length}</span>
              <span className="stat-label">Filtradas</span>
            </div>
          </div>
        )}
      </div>

      {filteredQuestions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">❓</div>
          <h3>Nenhuma questão encontrada</h3>
          <p>
            {filterMateria 
              ? `Não há questões para a matéria "${filterMateria}"`
              : 'Comece criando sua primeira questão!'
            }
          </p>
          {!filterMateria && (
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              ➕ Criar Primeira Questão
            </button>
          )}
        </div>
      ) : (
        <div className="questions-grid">
          {filteredQuestions.map(question => (
            <div key={question.id} className="question-card">
              <div className="question-header">
                <span className="question-materia">{question.materia}</span>
                <span className="question-date">
                  {new Date(question.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
              
              <div className="question-content">
                <h4 className="question-enunciado">
                  {question.enunciado.length > 100 
                    ? `${question.enunciado.substring(0, 100)}...`
                    : question.enunciado
                  }
                </h4>
                
                <div className="question-alternativas">
                  {question.alternativas.map((alt, index) => (
                    <div 
                      key={index} 
                      className={`alternativa ${alt.letra === question.correta ? 'correta' : ''}`}
                    >
                      <span className="alternativa-letra">{alt.letra})</span>
                      <span className="alternativa-texto">
                        {alt.texto.length > 50 
                          ? `${alt.texto.substring(0, 50)}...`
                          : alt.texto
                        }
                      </span>
                      {alt.letra === question.correta && (
                        <span className="correta-badge">✅</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="question-actions">
                <button
                  className="btn"
                  onClick={() => startEdit(question)}
                  title="Editar questão"
                >
                  ✏️ Editar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteQuestion(question.id)}
                  title="Deletar questão"
                >
                  🗑️ Deletar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <QuestionForm
          question={editingQuestion}
          onSubmit={editingQuestion ? handleEditQuestion : handleCreateQuestion}
          onClose={closeForm}
        />
      )}
    </div>
  );
};

export default QuestionManager;
