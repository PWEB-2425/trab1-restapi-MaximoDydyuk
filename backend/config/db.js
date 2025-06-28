// backend/config/db.js
import mongoose from 'mongoose';
import config from './config.js'; // Importar do novo config

const connectDB = async () => {
  try {
    console.log('URI do config:', config.MONGODB_URI);
    
    if (!config.MONGODB_URI) {
      throw new Error('MONGODB_URI não definida');
    }
    
    await mongoose.connect(config.MONGODB_URI);
    console.log(' MongoDB conectado com sucesso!');
  } catch (error) {
    console.error(' Erro de conexão com MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectDB;