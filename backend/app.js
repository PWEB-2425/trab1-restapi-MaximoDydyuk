// backend/app.js
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import alunoRoutes from './routes/alunoRoutes.js';
import cursoRoutes from './routes/cursoRoutes.js';
import { validateObjectId } from './middleware/validateObjectId.js';

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swagger.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

//swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Conectar ao banco de dados
connectDB();

// Middleware de validação de ObjectId
app.use('/api/alunos/:id', validateObjectId);
app.use('/api/cursos/:id', validateObjectId);

// Rotas
app.use('/api/alunos', alunoRoutes);
app.use('/api/cursos', cursoRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.send('API RESTful em execução!');
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado!' });
});

export default app;
