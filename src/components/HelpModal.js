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
                <strong>Posts de Conteúdo:</strong> Cada post representa um resumo semanal completo com material de estudo organizado. Você encontrará título descritivo, descrição resumida e conteúdo detalhado para aprofundar seus conhecimentos. Os posts são organizados cronologicamente, com os mais recentes aparecendo primeiro.
              </div>
            </div>
            <div className="help-item">
              <span className="help-icon">🎧</span>
              <div>
                <strong>Áudio Explicativo:</strong> Posts com o ícone 🎧 possuem conteúdo em áudio complementar. Perfeito para estudar enquanto se desloca, fazer exercícios ou quando preferir ouvir ao invés de ler. Clique no link para abrir o áudio em uma nova aba - ideal para revisão e fixação do conteúdo.
              </div>
            </div>
            <div className="help-item">
              <span className="help-icon">📄</span>
              <div>
                <strong>Material PDF:</strong> Documentos complementares com exercícios, tabelas, gráficos ou material de apoio detalhado. Clique no link para baixar ou visualizar diretamente no navegador. Recomendamos salvar os PDFs para consulta offline durante seus estudos.
              </div>
            </div>
          </div>

          <div className="help-section">
            <h3>📝 Questionários - Seu Melhor Aliado!</h3>
            <div className="help-item">
              <span className="help-icon">🎯</span>
              <div>
                <strong>Como Identificar:</strong> Posts que possuem questionários exibem uma seção destacada em verde com o botão "🚀 Iniciar Questionário". Esta é sua oportunidade de testar e consolidar o conhecimento adquirido com o conteúdo do post. Os questionários são cuidadosamente elaborados para reforçar os pontos-chave do material estudado.
              </div>
            </div>
            <div className="help-item">
              <span className="help-icon">⏱️</span>
              <div>
                <strong>Gestão de Tempo:</strong> Cada questionário indica um tempo estimado para conclusão, mas não se sinta pressionado! Este tempo é apenas uma referência. O importante é compreender cada questão. Você pode pausar, refletir e até mesmo fechar o questionário para consultar o material novamente - ele estará sempre disponível para uma nova tentativa.
              </div>
            </div>
            <div className="help-item">
              <span className="help-icon">💡</span>
              <div>
                <strong>Sistema de Dicas Inteligente:</strong> Cada questão possui uma dica estratégica disponível através do botão "💡 Ver Dica". Use-as como ferramenta de aprendizado! Tente responder primeiro com seu conhecimento, depois consulte a dica se necessário. As dicas são projetadas para guiar seu raciocínio sem entregar a resposta diretamente.
              </div>
            </div>
          </div>

          <div className="help-section">
            <h3>🎓 Estratégias para Maximizar seu Aprendizado</h3>
            <div className="help-tips">
              <div className="help-tip">
                <span className="tip-number">1</span>
                <div>
                  <strong>Estude Antes de Testar:</strong> Sempre leia completamente o conteúdo do post antes de iniciar o questionário. Esta é a base fundamental! O questionário serve para consolidar e testar o que você acabou de aprender, não para descobrir informações novas. Dedique tempo para compreender os conceitos apresentados.
                </div>
              </div>
              <div className="help-tip">
                <span className="tip-number">2</span>
                <div>
                  <strong>Estratégia das Dicas:</strong> Desenvolva uma abordagem inteligente: primeiro, leia a pergunta e tente formular uma resposta mental. Em seguida, analise as alternativas. Se estiver em dúvida, use a dica como orientação, não como muleta. As dicas são projetadas para estimular seu raciocínio crítico.
                </div>
              </div>
              <div className="help-tip">
                <span className="tip-number">3</span>
                <div>
                  <strong>Aprenda com os Feedbacks:</strong> Os feedbacks são o coração do aprendizado! Tanto para respostas corretas quanto incorretas, leia atentamente as explicações. Elas oferecem contexto adicional, esclarecem conceitos e frequentemente apresentam informações complementares que enriquecem seu conhecimento.
                </div>
              </div>
              <div className="help-tip">
                <span className="tip-number">4</span>
                <div>
                  <strong>Pratique Repetidamente:</strong> A repetição é a mãe da retenção! Refaça os questionários em momentos diferentes - imediatamente após estudar, no dia seguinte, e uma semana depois. Cada repetição fortalece as conexões neurais e melhora a retenção a longo prazo.
                </div>
              </div>
              <div className="help-tip">
                <span className="tip-number">5</span>
                <div>
                  <strong>Crie seu Material de Revisão:</strong> Use as explicações detalhadas dos feedbacks para criar flashcards, resumos ou mapas mentais personalizados. Transforme as informações do questionário em seu próprio sistema de revisão. Anote pontos que geraram dúvidas para revisão posterior.
                </div>
              </div>
            </div>
          </div>

          <div className="help-section">
            <h3>🎮 Passo a Passo: Como Funciona um Questionário</h3>
            <div className="help-flow">
              <div className="flow-step">
                <span className="flow-number">1</span>
                <div>
                  <strong>Inicialização:</strong> Localize a seção verde do questionário no post e clique em "🚀 Iniciar Questionário". Uma nova tela se abrirá com o ambiente de teste.
                </div>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <span className="flow-number">2</span>
                <div>
                  <strong>Leitura Crítica:</strong> Leia o enunciado com atenção total. Identifique palavras-chave, dados importantes e o que exatamente está sendo perguntado.
                </div>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <span className="flow-number">3</span>
                <div>
                  <strong>Análise das Alternativas:</strong> Examine cuidadosamente as 4 opções (A, B, C, D). Compare cada uma com o enunciado e elimine as obviamente incorretas.
                </div>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <span className="flow-number">4</span>
                <div>
                  <strong>Dica Estratégica:</strong> Se estiver em dúvida, clique em "💡 Ver Dica" para receber orientação adicional que pode esclarecer o caminho correto.
                </div>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <span className="flow-number">5</span>
                <div>
                  <strong>Seleção Final:</strong> Escolha a alternativa que considera correta clicando sobre ela. Tome sua decisão com base no conhecimento adquirido.
                </div>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <span className="flow-number">6</span>
                <div>
                  <strong>Aprendizado:</strong> Receba feedback instantâneo com explicação detalhada, seja para acerto ou erro. Este é o momento mais valioso para consolidar o conhecimento!
                </div>
              </div>
            </div>
          </div>

          <div className="help-section">
            <h3>⚡ Recursos Especiais da Plataforma</h3>
            <div className="help-item">
              <span className="help-icon">🔄</span>
              <div>
                <strong>Repetição Ilimitada:</strong> Todos os questionários podem ser reiniciados quantas vezes desejar! Feche a qualquer momento e reabra para uma nova tentativa. Ideal para reforçar conceitos difíceis ou testar sua evolução no aprendizado. Não há limite de tentativas - pratique até se sentir confiante.
              </div>
            </div>
            <div className="help-item">
              <span className="help-icon">📊</span>
              <div>
                <strong>Acompanhamento de Progresso:</strong> Durante o questionário, você sempre saberá sua posição através do contador de questões (ex: "Questão 2 de 5"). Isso ajuda a gerenciar seu tempo e expectativas, mantendo você informado sobre quantas questões ainda restam.
              </div>
            </div>
            <div className="help-item">
              <span className="help-icon">🎨</span>
              <div>
                <strong>Design Intuitivo:</strong> A interface foi cuidadosamente projetada com cores e ícones específicos para cada tipo de conteúdo. Verde para questionários, azul para áudios, vermelho para PDFs. Isso facilita a navegação rápida e identificação visual dos recursos disponíveis.
              </div>
            </div>
          </div>

          <div className="help-section success-tips">
            <h3>🏆 Técnicas Avançadas para Excelência nos Questionários</h3>
            <div className="success-grid">
              <div className="success-item">
                <span className="success-icon">🧠</span>
                <strong>Raciocínio Prévio</strong>
                <p>Antes de olhar as alternativas, formule mentalmente sua própria resposta baseada no que estudou. Isso evita que opções atrativas mas incorretas influenciem seu julgamento inicial.</p>
              </div>
              <div className="success-item">
                <span className="success-icon">❌</span>
                <strong>Eliminação Estratégica</strong>
                <p>Identifique e descarte imediatamente alternativas claramente incorretas ou absurdas. Isso aumenta suas chances mesmo quando não tem certeza absoluta da resposta correta.</p>
              </div>
              <div className="success-item">
                <span className="success-icon">🔍</span>
                <strong>Análise de Palavras-Chave</strong>
                <p>Preste atenção especial a palavras como "sempre", "nunca", "apenas", "somente". Elas frequentemente indicam alternativas incorretas, pois conceitos absolutos raramente são verdadeiros.</p>
              </div>
              <div className="success-item">
                <span className="success-icon">📝</span>
                <strong>Valorize os Erros</strong>
                <p>Erros são oportunidades de ouro! Leia atentamente o feedback das respostas incorretas - eles frequentemente contêm informações mais detalhadas e esclarecedoras que os acertos.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="help-modal-footer">
          <p>💪 <strong>Agora você está preparado!</strong> Com essas estratégias e conhecendo todos os recursos da plataforma, você tem tudo para maximizar seu aprendizado. Lembre-se: cada questionário é uma oportunidade de crescimento, cada erro é uma lição valiosa, e cada acerto é uma confirmação do seu progresso!</p>
          <button className="help-got-it-btn" onClick={onClose}>
            Perfeito! Vamos Estudar! 🚀
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;