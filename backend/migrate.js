import mongoose from 'mongoose';
import Aluno from './models/Aluno.js';
import Curso from './models/Curso.js';
import config from './config/config.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obter caminho do diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    const filePath = path.join(__dirname, '../mock-data/bd.json');
    const rawData = fs.readFileSync(filePath);
    const data = JSON.parse(rawData);
    
    // Verificar se os dados foram carregados corretamente
    if (!data.cursos || !data.alunos) {
      throw new Error('Estrutura inválida do arquivo JSON. Deve conter "cursos" e "alunos"');
    }

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

    // Criar mapa de IDs para nomes de curso
    const cursoMap = {};
    data.cursos.forEach(curso => {
      cursoMap[curso.id] = curso.nomeDoCurso;
    });

    // Inserir alunos com nomes de curso
    const alunos = await Aluno.insertMany(
      data.alunos.map(a => ({
        nome: a.nome,
        apelido: a.apelido,
        curso: cursoMap[a.curso] || `Curso ${a.curso}`, // Usar nome do curso
        anocurricular: a.anoCurricular,
        idade: a.idade
      }))
    );
    console.log(` ${alunos.length} alunos inseridos`);

    console.log(' Migração concluída!');
  } catch (error) {
    console.error(' Erro na migração:', error.message);
    console.error(error.stack); // Mostrar stack trace completo
  } finally {
    mongoose.disconnect();
  }
}