// backend/controllers/alunoController.js
import Aluno from '../models/Aluno.js';

// Obter todos alunos com paginação
export const getAlunos = async (req, res) => {
  try {
    // Paginação
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filtros
    const filters = {};
    if (req.query.nome) filters.nome = new RegExp(req.query.nome, 'i');
    if (req.query.curso) filters.curso = req.query.curso;
    if (req.query.anocurricular) filters.anocurricular = req.query.anocurricular;

    const [alunos, total] = await Promise.all([
      Aluno.find(filters).skip(skip).limit(limit),
      Aluno.countDocuments(filters)
    ]);

    res.status(200).json({
      data: alunos,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obter aluno por ID
export const getAlunoById = async (req, res) => {
  try {
    const aluno = await Aluno.findById(req.params.id);
    
    if (!aluno) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }
    
    res.status(200).json(aluno);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Criar novo aluno
export const createAluno = async (req, res) => {
  try {
    const { nome, apelido, curso, anocurricular, idade } = req.body;

    // Validação
    if (!nome || !apelido || !curso || !anocurricular || !idade) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Criar aluno
    const newAluno = await Aluno.create({
      nome,
      apelido,
      curso,
      anocurricular,
      idade
    });

    res.status(201).json(newAluno);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    res.status(400).json({ error: error.message });
  }
};

// Atualizar aluno
export const updateAluno = async (req, res) => {
  try {
    const { nome, apelido, curso, anocurricular, idade } = req.body;

    // Validação
    if (!nome || !apelido || !curso || !anocurricular || !idade) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const updatedAluno = await Aluno.findByIdAndUpdate(
      req.params.id,
      { nome, apelido, curso, anocurricular, idade },
      { new: true, runValidators: true }
    );

    if (!updatedAluno) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }

    res.status(200).json(updatedAluno);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    res.status(400).json({ error: error.message });
  }
};

// Excluir aluno
export const deleteAluno = async (req, res) => {
  try {
    const deletedAluno = await Aluno.findByIdAndDelete(req.params.id);
    
    if (!deletedAluno) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }
    
    res.status(200).json({ message: 'Aluno excluído com sucesso' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};