import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/authenticate`, { username, password });
  localStorage.setItem('token', response.data.token);
  return response.data;
};

export const getToken = () => localStorage.getItem('token');

export const logout = () => localStorage.removeItem('token');

export const isLoggedIn = () => !!getToken();