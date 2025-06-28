import mongoose from 'mongoose';

const CursoSchema = new mongoose.Schema({
  nomeDOCurso: {
    type: String,
    required: true,
    unique: true
  }
});

export default mongoose.model('Curso', CursoSchema);