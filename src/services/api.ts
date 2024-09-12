import axios from 'axios';
import * as bcrypt from 'bcryptjs'

const API_URL = import.meta.env.VITE_API_URL || 'http://jkom.com/api';
// const salt = bcrypt.genSaltSync(10)

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const encryptPassword = (password: string) => {
    const hashedPassword = bcrypt.hashSync(password, '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36Z5l5l5l5l5l5l5l5l5l')
    return hashedPassword
};

export const login = (email: string, password: string) => {
  const encryptedPassword = encryptPassword(password);
  return api.post('/auth/login', { email, password: encryptedPassword });
};

export const register = (email: string, password: string) => {
  const encryptedPassword = encryptPassword(password);
  return api.post('/auth/register', { email, password: encryptedPassword });
};

export default api;
