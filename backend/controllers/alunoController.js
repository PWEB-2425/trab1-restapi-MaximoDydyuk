import Aluno from '../models/Aluno.js';
import mongoose from 'mongoose';

// Obter todos alunos
export const getAlunos = async (req, res) => {
  try {
    const alunos = await Aluno.find();
    res.status(200).json(alunos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAlunoById = async (req, res) => {
  try {
    // Converter string para ObjectId
    const id = new mongoose.Types.ObjectId(req.params.id);
    const aluno = await Aluno.findById(id);
    
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
    const newAluno = await Aluno.create(req.body);
    res.status(201).json(newAluno);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Atualizar aluno
export const updateAluno = async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const updatedAluno = await Aluno.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!updatedAluno) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }
    
    res.status(200).json(updatedAluno);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Excluir aluno
export const deleteAluno = async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const deletedAluno = await Aluno.findByIdAndDelete(id);
    
    if (!deletedAluno) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }
    
    res.status(200).json({ message: 'Aluno excluído com sucesso' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};