import mongoose from 'mongoose';

const AlunoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  apelido: { type: String, required: true },
  curso: { type: String, required: true },
  anocurricular: { type: Number, required: true }
});

export default mongoose.model('Aluno', AlunoSchema);