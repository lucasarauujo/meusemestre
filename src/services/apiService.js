const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3001/api';

class ApiService {
  async fetchPosts() {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`);
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
      throw new Error('Falha ao carregar posts. Verifique sua conexão.');
    }
  }

  async createPost(postData) {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Erro HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar post:', error);
      throw new Error(error.message || 'Falha ao criar post.');
    }
  }

  async updatePost(id, postData) {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Erro HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar post:', error);
      throw new Error(error.message || 'Falha ao atualizar post.');
    }
  }

  async deletePost(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok && response.status !== 404) {
        const error = await response.json();
        throw new Error(error.error || `Erro HTTP: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Erro ao deletar post:', error);
      throw new Error(error.message || 'Falha ao deletar post.');
    }
  }
}

const apiService = new ApiService();
export default apiService;
