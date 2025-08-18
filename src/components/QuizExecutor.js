import React, { useState } from 'react';
import './QuizExecutor.css';

const QuizExecutor = ({ quiz, onClose }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === currentQuestion.correta;
    const newAnswer = {
      questionIndex: currentQuestionIndex,
      selectedAnswer,
      isCorrect,
      question: currentQuestion
    };

    setAnswers(prev => [...prev, newAnswer]);
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setAnswers([]);
    setQuizCompleted(false);
  };

  const getProgressPercentage = () => {
    return ((currentQuestionIndex + 1) / totalQuestions) * 100;
  };

  const getScore = () => {
    return answers.filter(answer => answer.isCorrect).length;
  };

  const getScorePercentage = () => {
    return (getScore() / totalQuestions) * 100;
  };

  if (quizCompleted) {
    return (
      <div className="quiz-executor-overlay">
        <div className="quiz-executor-modal">
          <div className="quiz-header">
            <h2>🎉 Questionário Concluído!</h2>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>

          <div className="quiz-results">
            <div className="score-section">
              <div className="score-circle">
                <span className="score-number">{getScore()}</span>
                <span className="score-total">/{totalQuestions}</span>
              </div>
              <div className="score-info">
                <h3>Seu Desempenho</h3>
                <p className="score-percentage">{getScorePercentage().toFixed(0)}% de acerto</p>
              </div>
            </div>

            <div className="answers-summary">
              <h4>📋 Resumo das Respostas</h4>
              {answers.map((answer, index) => (
                <div key={index} className={`answer-item ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                  <span className="answer-status">
                    {answer.isCorrect ? '✅' : '❌'}
                  </span>
                  <span className="answer-question">
                    Questão {index + 1}: {answer.question.enunciado.substring(0, 50)}...
                  </span>
                  <span className="answer-result">
                    {answer.isCorrect ? 'Correta' : 'Incorreta'}
                  </span>
                </div>
              ))}
            </div>

            <div className="quiz-actions">
              <button className="btn btn-secondary" onClick={handleRestartQuiz}>
                🔄 Refazer Questionário
              </button>
              <button className="btn btn-primary" onClick={onClose}>
                🏠 Voltar ao Feed
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-executor-overlay">
      <div className="quiz-executor-modal">
        <div className="quiz-header">
          <div className="quiz-title">
            <h2>📝 {quiz.titulo}</h2>
            <p className="quiz-subtitle">{quiz.descricao}</p>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="quiz-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
          <span className="progress-text">
            Questão {currentQuestionIndex + 1} de {totalQuestions}
          </span>
        </div>

        <div className="question-section">
          <div className="question-header">
            <h3>❓ Questão {currentQuestionIndex + 1}</h3>
            <span className="question-materia">📚 {currentQuestion.materia}</span>
          </div>

          <div className="question-content">
            <p className="question-enunciado">{currentQuestion.enunciado}</p>
            
            {currentQuestion.dica && (
              <div className="question-hint">
                💡 <strong>Dica:</strong> {currentQuestion.dica}
              </div>
            )}
          </div>

          <div className="alternatives-section">
            <h4>Alternativas:</h4>
            <div className="alternatives-list">
              {currentQuestion.alternativas.map((alt) => (
                <button
                  key={alt.letra}
                  className={`alternative-btn ${selectedAnswer === alt.letra ? 'selected' : ''}`}
                  onClick={() => handleAnswerSelect(alt.letra)}
                  disabled={showFeedback}
                >
                  <span className="alternative-letter">{alt.letra}</span>
                  <span className="alternative-text">{alt.texto}</span>
                </button>
              ))}
            </div>
          </div>

          {!showFeedback ? (
            <div className="question-actions">
              <button
                className="btn btn-primary"
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer}
              >
                📤 Responder Questão
              </button>
            </div>
          ) : (
            <div className="feedback-section">
              <div className={`feedback-result ${answers[answers.length - 1]?.isCorrect ? 'correct' : 'incorrect'}`}>
                <h4>
                  {answers[answers.length - 1]?.isCorrect ? '✅ Resposta Correta!' : '❌ Resposta Incorreta'}
                </h4>
                <p className="feedback-message">
                  {answers[answers.length - 1]?.isCorrect 
                    ? 'Parabéns! Você acertou esta questão.'
                    : 'Não se preocupe, vamos aprender com o erro.'
                  }
                </p>
              </div>

              <div className="feedback-details">
                <h5>📖 Explicação:</h5>
                <p className="feedback-explanation">{currentQuestion.explicacao}</p>
                
                <h5>💬 Feedbacks das Alternativas:</h5>
                <div className="feedback-alternatives">
                  {currentQuestion.feedbacks.map((feedback) => (
                    <div key={feedback.letra} className="feedback-alternative">
                      <span className="feedback-letter">{feedback.letra}</span>
                      <span className="feedback-text">{feedback.texto}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="feedback-actions">
                <button
                  className="btn btn-primary"
                  onClick={handleNextQuestion}
                >
                  {currentQuestionIndex < totalQuestions - 1 ? '⏭️ Próxima Questão' : '🏁 Finalizar Questionário'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizExecutor;
