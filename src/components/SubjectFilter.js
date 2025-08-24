import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import './SubjectFilter.css';

const SubjectFilter = ({ selectedMateria, onMateriaChange, postsCount }) => {
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMaterias();
  }, []);

  const loadMaterias = async () => {
    try {
      setLoading(true);
      const materiasData = await apiService.fetchMaterias();
      setMaterias(materiasData);
    } catch (error) {
      console.error('Erro ao carregar matérias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMateriaChange = (e) => {
    onMateriaChange(e.target.value);
  };

  const handleClearFilter = () => {
    onMateriaChange('Todas');
  };

  const getMateriaIcon = (materia) => {
    const iconMap = {
      'Todas': '📚',
      'Geral': '📋',
      'Psicologia Infantil': '🧸',
      'Técnicas de Avaliação Psicológica IV': '📊',
      'Psicossomática': '💊',
      'Psicofarmacologia': '💊',
      'Neurociência': '🧠',
      'Ética Profissional': '⚖️',
      'Estágio II: Saúde Mental': '🏥'
    };
    return iconMap[materia] || '📋';
  };

  return (
    <div className={`subject-filter ${loading ? 'loading' : ''}`}>
      <div className="filter-header">
        <h3 className="filter-title">
          🎯 Filtrar por Matéria
        </h3>
        
        <div className="filter-controls">
          <div className="subject-selector">
            <select
              className="subject-select"
              value={selectedMateria}
              onChange={handleMateriaChange}
              disabled={loading}
            >
              <option value="Todas">📚 Todas as Matérias</option>
              {materias.map(materia => (
                <option key={materia} value={materia}>
                  {getMateriaIcon(materia)} {materia}
                </option>
              ))}
            </select>
          </div>

          <div className="posts-count">
            📊 {postsCount} {postsCount === 1 ? 'post' : 'posts'}
          </div>

          {selectedMateria && selectedMateria !== 'Todas' && (
            <button
              className="clear-filter-btn"
              onClick={handleClearFilter}
              title="Limpar filtro"
            >
              ✕ Limpar
            </button>
          )}
        </div>
      </div>

      {selectedMateria && selectedMateria !== 'Todas' && (
        <p className="filter-description">
          Exibindo posts da matéria: <strong>{getMateriaIcon(selectedMateria)} {selectedMateria}</strong>
        </p>
      )}
    </div>
  );
};

export default SubjectFilter;
