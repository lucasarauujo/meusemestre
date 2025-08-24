const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3001/api';

class ApiService {
  async fetchPosts(materia = null) {
    try {
      let url = `${API_BASE_URL}/posts`;
      if (materia && materia !== 'Todas') {
        url += `?materia=${encodeURIComponent(materia)}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
      throw new Error('Falha ao carregar posts. Verifique sua conexão.');
    }
  }

  async fetchMaterias() {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/materias`);
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar matérias:', error);
      throw new Error('Falha ao carregar matérias. Verifique sua conexão.');
    }
  }

  async createPost(postData) {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...postData,
          quizId: postData.quizId || ''
        }),
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
        body: JSON.stringify({
          ...postData,
          quizId: postData.quizId || ''
        }),
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

  // ===== MÉTODOS PARA QUESTÕES =====

  async fetchQuestions() {
    try {
      const response = await fetch(`${API_BASE_URL}/questions`);
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar questões:', error);
      throw new Error('Falha ao carregar questões. Verifique sua conexão.');
    }
  }

  async fetchQuestionsByMateria(materia) {
    try {
      const response = await fetch(`${API_BASE_URL}/questions/materia/${encodeURIComponent(materia)}`);
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar questões por matéria:', error);
      throw new Error('Falha ao carregar questões da matéria.');
    }
  }

  async createQuestion(questionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Erro HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar questão:', error);
      throw new Error(error.message || 'Falha ao criar questão.');
    }
  }

  async updateQuestion(id, questionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/questions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Erro HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar questão:', error);
      throw new Error(error.message || 'Falha ao atualizar questão.');
    }
  }

  async deleteQuestion(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/questions/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok && response.status !== 404) {
        const error = await response.json();
        throw new Error(error.error || `Erro HTTP: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Erro ao deletar questão:', error);
      throw new Error(error.message || 'Falha ao deletar questão.');
    }
  }

  // ===== MÉTODOS PARA QUESTIONÁRIOS =====

  async fetchQuizzes() {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes`);
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar questionários:', error);
      throw new Error('Falha ao carregar questionários. Verifique sua conexão.');
    }
  }

  async fetchQuizById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/${id}`);
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar questionário:', error);
      throw new Error('Falha ao carregar questionário.');
    }
  }

  async createQuiz(quizData) {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Erro HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar questionário:', error);
      throw new Error(error.message || 'Falha ao criar questionário.');
    }
  }

  async updateQuiz(id, quizData) {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Erro HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar questionário:', error);
      throw new Error(error.message || 'Falha ao atualizar questionário.');
    }
  }

  async deleteQuiz(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok && response.status !== 404) {
        const error = await response.json();
        throw new Error(error.error || `Erro HTTP: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Erro ao deletar questionário:', error);
      throw new Error(error.message || 'Falha ao deletar questionário.');
    }
  }
}

const apiService = new ApiService();
export default apiService;
