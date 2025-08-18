import React from 'react';
import './Header.css';

const Header = ({ isAdmin, onAdminClick }) => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <h1>📚 Meu Semestre</h1>
            <p>Resumos, áudios e materiais semanais</p>
          </div>
          
          <nav className="nav">
            <button 
              className={`btn ${isAdmin ? 'btn-primary' : ''}`}
              onClick={onAdminClick}
            >
              {isAdmin ? (
                <>
                  👁️ Visualizar Feed
                </>
              ) : (
                <>
                  ⚙️ Área Admin
                </>
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
