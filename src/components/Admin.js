import React, { useState } from 'react';
import PostForm from './PostForm';
import './Admin.css';

const Admin = ({ posts, onAddPost, onDeletePost, onEditPost, onClearPosts }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

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

  const handleEdit = (post) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingPost(null);
  };

  const handleFormSubmit = (postData) => {
    if (editingPost) {
      onEditPost(editingPost.id, postData);
    } else {
      onAddPost(postData);
    }
    handleFormClose();
  };

  return (
    <div className="admin">
      <div className="container">
        <div className="admin-header">
          <div className="admin-title">
            <h2>⚙️ Área Administrativa</h2>
            <p>Gerencie seus posts e resumos semanais</p>
          </div>
          
          <div className="admin-actions">
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              ➕ Novo Post
            </button>
            
            {posts.length > 0 && (
              <button 
                className="btn btn-danger"
                onClick={onClearPosts}
                title="Limpar todos os posts para liberar espaço"
              >
                🧹 Limpar Todos
              </button>
            )}
          </div>
        </div>

        <div className="admin-content">
          <div className="admin-stats">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <span className="stat-number">{posts.length}</span>
                <span className="stat-label">Posts Publicados</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">🎵</div>
              <div className="stat-info">
                <span className="stat-number">
                  {posts.filter(p => p.audioFile).length}
                </span>
                <span className="stat-label">Áudios</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">📄</div>
              <div className="stat-info">
                <span className="stat-number">
                  {posts.filter(p => p.pdfFile).length}
                </span>
                <span className="stat-label">PDFs</span>
              </div>
            </div>
          </div>

          <div className="posts-management">
            <h3>📋 Gerenciar Posts</h3>
            
            {posts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <h4>Nenhum post criado ainda</h4>
                <p>Clique em "Novo Post" para começar a adicionar conteúdo.</p>
              </div>
            ) : (
              <div className="posts-table">
                {posts.map(post => (
                  <div key={post.id} className="post-row">
                    <div className="post-info">
                      <h4 className="post-title">{post.title}</h4>
                      <p className="post-description">{post.description}</p>
                      <div className="post-meta">
                        <span className="post-date">
                          📅 {formatDate(post.createdAt)}
                        </span>
                        {post.audioFile && (
                          <span className="attachment-badge">
                            🎵 Áudio
                          </span>
                        )}
                        {post.pdfFile && (
                          <span className="attachment-badge">
                            📄 PDF
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="post-actions">
                      <button 
                        className="btn btn-sm"
                        onClick={() => handleEdit(post)}
                      >
                        ✏️ Editar
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => {
                          if (window.confirm('Tem certeza que deseja excluir este post?')) {
                            onDeletePost(post.id);
                          }
                        }}
                      >
                        🗑️ Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {showForm && (
          <PostForm
            post={editingPost}
            onSubmit={handleFormSubmit}
            onClose={handleFormClose}
          />
        )}
      </div>
    </div>
  );
};

export default Admin;
