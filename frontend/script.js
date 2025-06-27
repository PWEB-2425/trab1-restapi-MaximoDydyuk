// URLs da API
const API_ALUNOS = 'http://localhost:3001/alunos';
const API_CURSOS = 'http://localhost:3001/cursos';

// Elementos DOM
const alunoForm = document.getElementById('alunoForm');
const tabelaAlunos = document.getElementById('tabelaAlunos').querySelector('tbody');
const selectCurso = document.getElementById('curso');

// Estado global
let modoEdicao = false;

// 1. Carregar dados iniciais
document.addEventListener('DOMContentLoaded', async () => {
    await carregarCursos();
    await carregarAlunos();
});

// Carregar cursos para o dropdown
async function carregarCursos() {
    try {
        const response = await fetch(API_CURSOS);
        const cursos = await response.json();
        
        cursos.forEach(curso => {
            const option = document.createElement('option');
            option.value = curso.id;
            option.textContent = curso.nomeDoCurso;
            selectCurso.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar cursos:', error);
        alert('Não foi possível carregar os cursos');
    }
}

// Carregar alunos para a tabela
async function carregarAlunos() {
    try {
        const response = await fetch(API_ALUNOS);
        const alunos = await response.json();
        
        tabelaAlunos.innerHTML = '';
        
        alunos.forEach(aluno => {
            const tr = document.createElement('tr');
            
            // Buscar nome do curso
            const curso = document.querySelector(`#curso option[value="${aluno.curso}"]`);
            const nomeCurso = curso ? curso.textContent : 'Curso não encontrado';
            
            tr.innerHTML = `
                <td>${aluno.id}</td>
                <td>${aluno.nome}</td>
                <td>${aluno.apelido}</td>
                <td>${nomeCurso}</td>
                <td>${aluno.anoCurricular}</td>
                <td>${aluno.idade}</td>
                <td>
                    <button class="btn-editar" onclick="editarAluno(${aluno.id})">Editar</button>
                    <button class="btn-excluir" onclick="excluirAluno(${aluno.id})">Excluir</button>
                </td>
            `;
            
            tabelaAlunos.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao carregar alunos:', error);
        alert('Não foi possível carregar os alunos');
    }
}

// 2. Manipular envio do formulário
alunoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const aluno = {
        nome: document.getElementById('nome').value,
        apelido: document.getElementById('apelido').value,
        curso: parseInt(document.getElementById('curso').value),
        anoCurricular: parseInt(document.getElementById('anoCurricular').value),
        idade: parseInt(document.getElementById('idade').value)
    };
    
    const alunoId = document.getElementById('alunoId').value;
    const url = alunoId ? `${API_ALUNOS}/${alunoId}` : API_ALUNOS;
    const method = alunoId ? 'PUT' : 'POST';
    
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(aluno)
        });
        
        if (!response.ok) {
            throw new Error('Falha na operação');
        }
        
        // Resetar formulário e recarregar dados
        alunoForm.reset();
        document.getElementById('alunoId').value = '';
        await carregarAlunos();
        
        alert(alunoId ? 'Aluno atualizado com sucesso!' : 'Aluno criado com sucesso!');
        
    } catch (error) {
        console.error('Erro ao salvar aluno:', error);
        alert('Erro ao salvar aluno. Veja o console para detalhes.');
    }
});

// 3. Editar aluno
async function editarAluno(id) {
    try {
        const response = await fetch(`${API_ALUNOS}/${id}`);
        const aluno = await response.json();
        
        // Preencher formulário
        document.getElementById('alunoId').value = aluno.id;
        document.getElementById('nome').value = aluno.nome;
        document.getElementById('apelido').value = aluno.apelido;
        document.getElementById('curso').value = aluno.curso;
        document.getElementById('anoCurricular').value = aluno.anoCurricular;
        document.getElementById('idade').value = aluno.idade;
        
        // Scroll para o formulário
        document.getElementById('alunoForm').scrollIntoView();
        
    } catch (error) {
        console.error('Erro ao carregar aluno para edição:', error);
        alert('Erro ao carregar dados do aluno');
    }
}

// 4. Excluir aluno
async function excluirAluno(id) {
    if (!confirm('Tem certeza que deseja excluir este aluno?')) return;
    
    try {
        const response = await fetch(`${API_ALUNOS}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Falha ao excluir aluno');
        }
        
        await carregarAlunos();
        alert('Aluno excluído com sucesso!');
        
    } catch (error) {
        console.error('Erro ao excluir aluno:', error);
        alert('Erro ao excluir aluno. Veja o console para detalhes.');
    }
}// JS para operações CRUD com Fetch API
