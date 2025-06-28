import mongoose from 'mongoose';
import Aluno from './models/Aluno.js';
import Curso from './models/Curso.js';
import config from './config/config.js';
import fs from 'fs';

// Conectar ao MongoDB
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log(' Conectado ao MongoDB');
    return migrate();
  })
  .catch(err => console.error(' Erro de conexão:', err));

async function migrate() {
  try {
    // Carregar dados do arquivo JSON
    const data = JSON.parse(fs.readFileSync('../mock-data/bd.json'));

    // Limpar coleções
    await Promise.all([
      Aluno.deleteMany({}),
      Curso.deleteMany({})
    ]);
    console.log(' Coleções limpas');

    // Inserir cursos
    const cursos = await Curso.insertMany(
      data.cursos.map(c => ({ nomeDOCurso: c.nomeDoCurso }))
    );
    console.log(` ${cursos.length} cursos inseridos`);

    // Inserir alunos
    const alunos = await Aluno.insertMany(
      data.alunos.map(a => ({
        nome: a.nome,
        apelido: a.apelido,
        curso: a.curso,
        anocurricular: a.anoCurricular 
      }))
    );
    console.log(` ${alunos.length} alunos inseridos`);

    console.log(' Migração concluída!');
  } catch (error) {
    console.error(' Erro na migração:', error.message);
  } finally {
    mongoose.disconnect();
  }
}