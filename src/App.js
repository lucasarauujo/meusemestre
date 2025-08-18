import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Feed from './components/Feed';
import Admin from './components/Admin';
import LoginModal from './components/LoginModal';
import apiService from './services/apiService';

function App() {
  const [posts, setPosts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar posts da API ao inicializar
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedPosts = await apiService.fetchPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
      setError(error.message);
      // Fallback para localStorage se a API não estiver disponível
      const savedPosts = localStorage.getItem('meuSemestre_posts');
      if (savedPosts) {
        setPosts(JSON.parse(savedPosts));
        setError('⚠️ Usando dados locais - verifique se o servidor está rodando');
      }
    } finally {
      setLoading(false);
    }
  };

  const addPost = async (postData) => {
    try {
      const newPost = await apiService.createPost(postData);
      setPosts([newPost, ...posts]);
      return newPost;
    } catch (error) {
      alert(`❌ Erro ao criar post: ${error.message}`);
      throw error;
    }
  };

  const deletePost = async (id) => {
    try {
      await apiService.deletePost(id);
      setPosts(posts.filter(post => post.id !== id));
    } catch (error) {
      alert(`❌ Erro ao deletar post: ${error.message}`);
      throw error;
    }
  };

  const editPost = async (id, updatedPostData) => {
    try {
      const updatedPost = await apiService.updatePost(id, updatedPostData);
      setPosts(posts.map(post => 
        post.id === id ? updatedPost : post
      ));
      return updatedPost;
    } catch (error) {
      alert(`❌ Erro ao atualizar post: ${error.message}`);
      throw error;
    }
  };

  const clearOldPosts = async () => {
    if (window.confirm('🗑️ Limpar TODOS os posts?\n\nEsta ação não pode ser desfeita!')) {
      try {
        // Deletar todos os posts um por um
        for (const post of posts) {
          await apiService.deletePost(post.id);
        }
        setPosts([]);
        alert('✅ Todos os posts foram removidos!');
      } catch (error) {
        alert(`❌ Erro ao limpar posts: ${error.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="App">
        <Header 
          isAdmin={isAdmin}
          onAdminClick={() => isAdmin ? setIsAdmin(false) : setShowLogin(true)}
        />
        <div className="loading-state">
          <div className="loading-icon">⏳</div>
          <h3>Carregando posts...</h3>
          <p>Conectando ao servidor</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Header 
        isAdmin={isAdmin}
        onAdminClick={() => isAdmin ? setIsAdmin(false) : setShowLogin(true)}
      />
      
      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          <span className="error-message">{error}</span>
          <button 
            className="retry-btn"
            onClick={loadPosts}
            title="Tentar novamente"
          >
            🔄 Tentar novamente
          </button>
        </div>
      )}
      
      {isAdmin ? (
        <Admin 
          posts={posts}
          onAddPost={addPost}
          onDeletePost={deletePost}
          onEditPost={editPost}
          onClearPosts={clearOldPosts}
        />
      ) : (
        <Feed posts={posts} />
      )}

      {showLogin && (
        <LoginModal
          onLogin={() => {
            setIsAdmin(true);
            setShowLogin(false);
          }}
          onClose={() => setShowLogin(false)}
        />
      )}
    </div>
  );
}

export default App;
