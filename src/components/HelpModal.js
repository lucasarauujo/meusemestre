import React from 'react';
import './HelpModal.css';

const HelpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="help-modal-overlay" onClick={onClose}>
      <div className="help-modal" onClick={(e) => e.stopPropagation()}>
        <div className="help-modal-header">
          <h2>📚 Como Usar o Meu Semestre</h2>
          <button className="help-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="help-modal-content">
          <div className="help-section">
            <h3>🏠 Navegando pelo Feed</h3>
            <div className="help-item">
              <span className="help-icon">📖</span>
              <div>
                <strong>Posts de Conteúdo:</strong> Cada post contém material de estudo com título, descrição e conteúdo detalhado.
              </div>
            </div>
            <div className="help-item">
              <span className="help-icon">🎧</span>
              <div>
                <strong>Áudio:</strong> Alguns posts têm links de áudio. Clique para ouvir o conteúdo em formato de podcast.
              </div>
            </div>
            <div className="help-item">
              <span className="help-icon">📄</span>
              <div>
                <strong>PDF:</strong> Material complementar em PDF. Clique para baixar ou visualizar.
              </div>
            </div>
          </div>

          <div className="help-section">
            <h3>📝 Questionários - Seu Melhor Aliado!</h3>
            <div className="help-item">
              <span className="help-icon">🎯</span>
              <div>
                <strong>Identificação:</strong> Posts com questionários mostram o botão "🚀 Iniciar Questionário".
              </div>
            </div>
            <div className="help-item">
              <span className="help-icon">⏱️</span>
              <div>
                <strong>Tempo:</strong> Cada questionário tem um tempo estimado. Use-o como referência, mas não se apresse!
              </div>
            </div>
            <div className="help-item">
              <span className="help-icon">💡</span>
              <div>
                <strong>Dicas Disponíveis:</strong> Clique em "💡 Ver Dica" quando estiver em dúvida. Use estrategicamente!
              </div>
            </div>
          </div>

          <div className="help-section">
            <h3>🎓 Dicas para Maximizar seu Aprendizado</h3>
            <div className="help-tips">
              <div className="help-tip">
                <span className="tip-number">1</span>
                <div>
                  <strong>Leia o Conteúdo Primeiro:</strong> Sempre estude o material do post antes de fazer o questionário.
                </div>
              </div>
              <div className="help-tip">
                <span className="tip-number">2</span>
                <div>
                  <strong>Use as Dicas com Sabedoria:</strong> Tente responder primeiro, depois use a dica se necessário.
                </div>
              </div>
              <div className="help-tip">
                <span className="tip-number">3</span>
                <div>
                  <strong>Leia os Feedbacks:</strong> Tanto para acertos quanto erros, os feedbacks são valiosos para fixar o conhecimento.
                </div>
              </div>
              <div className="help-tip">
                <span className="tip-number">4</span>
                <div>
                  <strong>Refaça os Questionários:</strong> Você pode fechar e reabrir quantas vezes quiser para praticar.
                </div>
              </div>
              <div className="help-tip">
                <span className="tip-number">5</span>
                <div>
                  <strong>Anote Suas Dúvidas:</strong> Use as explicações detalhadas para criar seus próprios resumos.
                </div>
              </div>
            </div>
          </div>

          <div className="help-section">
            <h3>🎮 Como Funciona um Questionário</h3>
            <div className="help-flow">
              <div className="flow-step">
                <span className="flow-number">1</span>
                <div>
                  <strong>Início:</strong> Clique em "🚀 Iniciar Questionário" no post
                </div>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <span className="flow-number">2</span>
                <div>
                  <strong>Pergunta:</strong> Leia atentamente o enunciado
                </div>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <span className="flow-number">3</span>
                <div>
                  <strong>Opções:</strong> Analise as 4 alternativas (A, B, C, D)
                </div>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <span className="flow-number">4</span>
                <div>
                  <strong>Dica:</strong> Use "💡 Ver Dica" se necessário
                </div>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <span className="flow-number">5</span>
                <div>
                  <strong>Resposta:</strong> Selecione sua alternativa
                </div>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <span className="flow-number">6</span>
                <div>
                  <strong>Feedback:</strong> Veja o resultado e explicação
                </div>
              </div>
            </div>
          </div>

          <div className="help-section">
            <h3>⚡ Recursos Especiais</h3>
            <div className="help-item">
              <span className="help-icon">🔄</span>
              <div>
                <strong>Reiniciar:</strong> Você pode fechar e reabrir qualquer questionário para treinar novamente.
              </div>
            </div>
            <div className="help-item">
              <span className="help-icon">📊</span>
              <div>
                <strong>Progresso:</strong> Veja quantas questões faltam no contador do questionário.
              </div>
            </div>
            <div className="help-item">
              <span className="help-icon">🎨</span>
              <div>
                <strong>Interface Amigável:</strong> Cores e ícones ajudam a identificar rapidamente cada tipo de conteúdo.
              </div>
            </div>
          </div>

          <div className="help-section success-tips">
            <h3>🏆 Dicas de Ouro para o Sucesso</h3>
            <div className="success-grid">
              <div className="success-item">
                <span className="success-icon">🧠</span>
                <strong>Raciocine Antes</strong>
                <p>Pense na resposta antes de ver as alternativas</p>
              </div>
              <div className="success-item">
                <span className="success-icon">❌</span>
                <strong>Elimine Opções</strong>
                <p>Descarte alternativas obviamente incorretas</p>
              </div>
              <div className="success-item">
                <span className="success-icon">🔍</span>
                <strong>Atenção aos Detalhes</strong>
                <p>Palavras como "sempre", "nunca" podem ser pistas</p>
              </div>
              <div className="success-item">
                <span className="success-icon">📝</span>
                <strong>Aprenda com Erros</strong>
                <p>Os feedbacks de erro são tão importantes quanto os de acerto</p>
              </div>
            </div>
          </div>
        </div>

        <div className="help-modal-footer">
          <p>💪 <strong>Lembre-se:</strong> A prática leva à perfeição. Quanto mais você usar os questionários, melhor será seu desempenho!</p>
          <button className="help-got-it-btn" onClick={onClose}>
            Entendi! Vamos Estudar! 🚀
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;