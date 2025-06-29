// backend/config/config.js
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Obter caminho do diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregar .env do diretório raiz do backend
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export default {
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: process.env.PORT || 5000
};