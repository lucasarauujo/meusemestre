import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import './MateriaSelector.css';

const MateriaSelector = ({ onMateriaSelected, onViewAll }) => {
  const [selectedMateria, setSelectedMateria] = useState(null);
  const [materiaStats, setMateriaStats] = useState({});

  const materias = [
    {
      id: 'geral',
      name: 'Geral',
      icon: '📋',
      description: 'Posts gerais e conteúdo diverso'
    },
    {
      id: 'psicologia-infantil',
      name: 'Psicologia Infantil',
      icon: '🧸',
      description: 'Desenvolvimento psicológico e comportamental na infância'
    },
    {
      id: 'tecnicas-avaliacao',
      name: 'Técnicas de Avaliação Psicológica IV',
      icon: '📊',
      description: 'Métodos e instrumentos para avaliação psicológica'
    },
    {
      id: 'psicossomatica',
      name: 'Psicossomática',
      icon: '💊',
      description: 'Relação entre mente e corpo na saúde e doença'
    },
    {
      id: 'psicofarmacologia',
      name: 'Psicofarmacologia',
      icon: '💊',
      description: 'Medicamentos e tratamentos farmacológicos em psicologia'
    },
    {
      id: 'neurociencia',
      name: 'Neurociência',
      icon: '🧠',
      description: 'Estudo do sistema nervoso e suas funções'
    },
    {
      id: 'etica-profissional',
      name: 'Ética Profissional',
      icon: '⚖️',
      description: 'Princípios éticos na prática da psicologia'
    },
    {
      id: 'estagio-saude-mental',
      name: 'Estágio II: Saúde Mental',
      icon: '🏥',
      description: 'Prática supervisionada em saúde mental'
    }
  ];

  useEffect(() => {
    loadMateriaStats();
  }, []);

  const loadMateriaStats = async () => {
    try {
      console.log('🔄 Carregando estatísticas das matérias...');
      const stats = {};
      for (const materia of materias) {
        try {
          console.log(`📊 Carregando posts da matéria: ${materia.name}`);
          const posts = await apiService.fetchPosts(materia.name);
          console.log(`✅ ${materia.name}: ${posts.length} posts encontrados`);
          stats[materia.id] = posts.length;
        } catch (materiaError) {
          console.error(`❌ Erro ao carregar posts da matéria ${materia.name}:`, materiaError);
          stats[materia.id] = 0;
        }
      }
      console.log('📊 Estatísticas carregadas:', stats);
      setMateriaStats(stats);
    } catch (error) {
      console.error('❌ Erro geral ao carregar estatísticas:', error);
      // Fallback: definir todas as matérias com 0 posts
      const fallbackStats = {};
      materias.forEach(materia => {
        fallbackStats[materia.id] = 0;
      });
      setMateriaStats(fallbackStats);
    }
  };

  const handleMateriaClick = (materia) => {
    setSelectedMateria(materia);
  };

  const handleContinue = () => {
    if (selectedMateria) {
      onMateriaSelected(selectedMateria.name);
    }
  };

  const handleViewAll = () => {
    onViewAll();
  };

  const totalPosts = Object.values(materiaStats).reduce((sum, count) => sum + count, 0);

  return (
    <div className="materia-selector-screen">
      <div className="materia-selector-container">
        <div className="materia-selector-header">
          <h1 className="materia-selector-title">🎓 Meu Semestre</h1>
          <p className="materia-selector-subtitle">Selecione uma matéria para continuar</p>
          <p className="materia-selector-description">
            Escolha a matéria que deseja visualizar ou veja todos os posts disponíveis
          </p>
        </div>

        <div className="materia-grid">
          {materias.map((materia) => (
            <div
              key={materia.id}
              className={`materia-card ${selectedMateria?.id === materia.id ? 'selected' : ''}`}
              onClick={() => handleMateriaClick(materia)}
            >
              <span className="materia-icon">{materia.icon}</span>
              <h3 className="materia-name">{materia.name}</h3>
              <p className="materia-description">{materia.description}</p>
            </div>
          ))}
        </div>

        <div className="materia-actions">
          <button
            className="continue-btn"
            onClick={handleContinue}
            disabled={!selectedMateria}
          >
            {selectedMateria ? `📚 Ver Posts de ${selectedMateria.name}` : 'Selecione uma matéria'}
          </button>
          
          <button className="view-all-btn" onClick={handleViewAll}>
            📋 Ver Todos os Posts
          </button>
        </div>

        <div className="materia-stats">
          <div className="stat-item">
            <span className="stat-number">{totalPosts}</span>
            <span className="stat-label">Total de Posts</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{materias.length}</span>
            <span className="stat-label">Matérias</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {selectedMateria ? materiaStats[selectedMateria.id] || 0 : '-'}
            </span>
            <span className="stat-label">Posts Selecionados</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MateriaSelector;
