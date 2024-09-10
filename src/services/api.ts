import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const encryptPassword = (password: string, secretKey: string) => {
  // Hash the secret key and truncate to 32 bytes
  const hash = crypto.createHash('sha256');
  hash.update(secretKey);
  const key = hash.digest().slice(0, 32); // Ensure the key is 32 bytes long
  
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  
  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted;
}

export const login = (email: string, password: string) => {
  const encryptedPassword = encryptPassword(password, SECRET_KEY)
  return api.post('/auth/login', { email, password: encryptedPassword })
}

export default api
