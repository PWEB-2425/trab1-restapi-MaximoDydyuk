// URLs da API
const API_ALUNOS = 'http://localhost:3001/alunos';
const API_CURSOS = 'http://localhost:3001/cursos';

// Elementos DOM
const alunoForm = document.getElementById('alunoForm');
const tabelaAlunos = document.getElementById('tabelaAlunos').querySelector('tbody');
const selectCurso = document.getElementById('curso');
const btnSalvar = document.getElementById('btnSalvar');
const btnCancelar = document.getElementById('btnCancelar');

// Carregar dados iniciais
document.addEventListener('DOMContentLoaded', async () => {
    await carregarCursos();
    await carregarAlunos();
    
    btnCancelar.addEventListener('click', () => {
        alunoForm.reset();
        document.getElementById('alunoId').value = '';
        btnCancelar.style.display = 'none';
        btnSalvar.textContent = 'Salvar Aluno';
    });
});

// Carregar cursos para o dropdown
async function carregarCursos() {
    try {
        const response = await fetch(API_CURSOS);
        const cursos = await response.json();
        
        selectCurso.innerHTML = '<option value="">Selecione um curso</option>';
        
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
        
        alunos.forEach(aluno => adicionarAlunoNaTabela(aluno));
    } catch (error) {
        console.error('Erro ao carregar alunos:', error);
        alert('Não foi possível carregar os alunos');
    }
}

// Adicionar aluno na tabela
function adicionarAlunoNaTabela(aluno) {
    const tr = document.createElement('tr');
    tr.id = `aluno-${aluno.id}`;
    
    const cursoOption = document.querySelector(`#curso option[value="${aluno.curso}"]`);
    const nomeCurso = cursoOption ? cursoOption.textContent : 'Curso não encontrado';
    
    tr.innerHTML = `
        <td>${aluno.id}</td>
        <td>${aluno.nome}</td>
        <td>${aluno.apelido}</td>
        <td>${nomeCurso}</td>
        <td>${aluno.anoCurricular}</td>
        <td>${aluno.idade}</td>
        <td class="action-buttons">
            <button class="btn-editar" onclick="editarAluno('${aluno.id}')">Editar</button>
            <button class="btn-excluir" onclick="excluirAluno('${aluno.id}')">Excluir</button>
        </td>
    `;
    
    tabelaAlunos.appendChild(tr);
}

// Manipular envio do formulário
alunoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const aluno = {
        nome: document.getElementById('nome').value,
        apelido: document.getElementById('apelido').value,
        curso: parseInt(selectCurso.value),
        anoCurricular: parseInt(document.getElementById('anoCurricular').value),
        idade: parseInt(document.getElementById('idade').value)
    };
    
    const alunoId = document.getElementById('alunoId').value;
    const url = alunoId ? `${API_ALUNOS}/${alunoId}` : API_ALUNOS;
    const method = alunoId ? 'PUT' : 'POST';
    
    try {
        const response = await fetch(url, {
            method,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(aluno)
        });
        
        if (!response.ok) throw new Error('Operação falhou');
        
        const alunoSalvo = await response.json();
        
        if (alunoId) document.getElementById(`aluno-${alunoId}`).remove();
        adicionarAlunoNaTabela(alunoSalvo);
        
        alunoForm.reset();
        document.getElementById('alunoId').value = '';
        btnCancelar.style.display = 'none';
        btnSalvar.textContent = 'Salvar Aluno';
        
        alert(alunoId ? 'Aluno atualizado!' : 'Aluno criado!');
    } catch (error) {
        console.error('Erro ao salvar aluno:', error);
        alert(`Erro: ${error.message}`);
    }
});

// Editar aluno
window.editarAluno = async function(id) {
    try {
        const response = await fetch(`${API_ALUNOS}/${id}`);
        if (!response.ok) throw new Error('Aluno não encontrado');
        
        const aluno = await response.json();
        
        document.getElementById('alunoId').value = aluno.id;
        document.getElementById('nome').value = aluno.nome;
        document.getElementById('apelido').value = aluno.apelido;
        selectCurso.value = aluno.curso;
        document.getElementById('anoCurricular').value = aluno.anoCurricular;
        document.getElementById('idade').value = aluno.idade;
        
        btnSalvar.textContent = 'Atualizar Aluno';
        btnCancelar.style.display = 'inline-block';
    } catch (error) {
        console.error('Erro ao carregar aluno:', error);
        alert(`Erro: ${error.message}`);
    }
}

// Excluir aluno
window.excluirAluno = async function(id) {
    if (!confirm('Tem certeza que deseja excluir?')) return;
    
    try {
        const response = await fetch(`${API_ALUNOS}/${id}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}
        });
        
        if (!response.ok) throw new Error('Falha na exclusão');
        
        document.getElementById(`aluno-${id}`).remove();
        if (document.getElementById('alunoId').value === id) {
            alunoForm.reset();
            btnCancelar.style.display = 'none';
            btnSalvar.textContent = 'Salvar Aluno';
        }
        
        alert('Aluno excluído!');
    } catch (error) {
        console.error('Erro ao excluir aluno:', error);
        alert(`Erro: ${error.message}`);
    }
}
