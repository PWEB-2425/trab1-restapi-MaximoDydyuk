import express from 'express';
import {
  getAlunos,
  getAlunoById,
  createAluno,
  updateAluno,
  deleteAluno
} from '../controllers/alunoController.js';

const router = express.Router();

router.get('/', getAlunos);
router.get('/:id', getAlunoById);
router.post('/', createAluno);
router.put('/:id', updateAluno);
router.delete('/:id', deleteAluno);

export default router;