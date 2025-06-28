import Curso from '../models/Curso.js';

// Obter todos cursos
export const getCursos = async (req, res) => {
  try {
    const cursos = await Curso.find();
    res.status(200).json(cursos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Criar novo curso
export const createCurso = async (req, res) => {
  try {
    const newCurso = await Curso.create(req.body);
    res.status(201).json(newCurso);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Atualizar curso
export const updateCurso = async (req, res) => {
  try {
    const updatedCurso = await Curso.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedCurso);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Excluir curso
export const deleteCurso = async (req, res) => {
  try {
    await Curso.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Curso excluído com sucesso' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};