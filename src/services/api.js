import axios from 'axios';

const BASE_URL = 'http://192.168.1.18:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

export const login = async (email, senha) => {
  try {
    const response = await api.post('/auth/login', { email, senha });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Erro ao fazer login');
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', {
      nome: userData.nome,
      email: userData.email,
      telefone: userData.telefone,
      senha: userData.senha,
      confirmarSenha: userData.confirmarSenha,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Erro ao registrar usuário');
  }
};

export const getUser = async (id) => {
  try {
    const response = await api.get(`/auth/user/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Erro ao obter informações do usuário');
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/auth/user/${id}`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Erro ao atualizar informações do usuário');
  }
};

export const getUserNameByEmail = async (email) => {
  try {
    const response = await api.get(`/auth/usuarios/${email}`);
    return response.data.Nome;
  } catch (error) {
    throw new Error(error.response.data.message || 'Erro ao obter nome do usuário');
  }
};

export default api;
