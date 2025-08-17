import React, { useState } from 'react';
import './LoginModal.css';

const LoginModal = ({ onLogin, onClose }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password === 'lu10505') {
      onLogin();
      setError('');
    } else {
      setError('Senha incorreta. Tente novamente.');
      setPassword('');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal login-modal">
        <div className="modal-header">
          <h3>🔐 Acesso Administrativo</h3>
          <button 
            className="close-btn"
            onClick={onClose}
            type="button"
          >
            ✕
          </button>
        </div>

        <div className="login-content">
          <p className="login-description">
            Digite a senha para acessar a área administrativa e gerenciar os posts.
          </p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="password">🔑 Senha</label>
              <input
                type="password"
                id="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                autoFocus
                required
              />
            </div>

            {error && (
              <div className="error-message">
                ⚠️ {error}
              </div>
            )}

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
                🚀 Entrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
