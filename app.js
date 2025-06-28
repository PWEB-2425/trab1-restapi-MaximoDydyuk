// backend/app.js
import express from 'express';
import connectDB from './config/db.js';
import alunoRoutes from './routes/alunoRoutes.js';
import cursoRoutes from './routes/cursoRoutes.js';

const app = express();

app.use(express.json());

// Conectar ao banco de dados
connectDB();

// Rotas
app.use('/api/alunos', alunoRoutes);
app.use('/api/cursos', cursoRoutes);

app.get('/', (req, res) => {
  res.send('API RESTful em execução!');
});

export default app;