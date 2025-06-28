// URLs da API
const API_ALUNOS = 'http://localhost:3001/alunos';
const API_CURSOS = 'http://localhost:3001/cursos';
const API_URL = "https://trabalho-pweb-api.onrender.com/api";

// Elementos DOM
const alunoForm = document.getElementById('alunoForm');
const tabelaAlunos = document.getElementById('tabelaAlunos').querySelector('tbody');
const selectCurso = document.getElementById('curso');
const btnSalvar = document.getElementById('btnSalvar');
const btnCancelar = document.getElementById('btnCancelar');
const idInput = document.getElementById('idInput');
const idContainer = document.getElementById('idContainer');
const idError = document.getElementById('idError');

// Cache de IDs existentes
let existingIds = new Set();

// Carregar dados iniciais
document.addEventListener('DOMContentLoaded', async () => {
    await carregarCursos();
    await carregarAlunos();
    
    // Preencher cache de IDs
    const alunos = await fetch(API_ALUNOS).then(res => res.json());
    alunos.forEach(aluno => existingIds.add(aluno.id));
    
    btnCancelar.addEventListener('click', () => {
        alunoForm.reset();
        document.getElementById('alunoId').value = '';
        idInput.value = '';
        btnCancelar.style.display = 'none';
        btnSalvar.textContent = 'Salvar Aluno';
        idContainer.style.display = 'block';
        resetarErroID();
    });
    
    // Verificar ID em tempo real
    idInput.addEventListener('input', verificarIdDuplicado);
});

// Função para verificar ID duplicado
function verificarIdDuplicado() {
    const id = idInput.value.trim();
    resetarErroID();
    
    if (id && existingIds.has(id)) {
        mostrarErroID('Este ID já está em uso!');
        return true;
    }
    return false;
}

function mostrarErroID(mensagem) {
    idError.textContent = mensagem;
    idError.style.display = 'block';
    idInput.classList.add('input-error');
}

function resetarErroID() {
    idError.textContent = '';
    idError.style.display = 'none';
    idInput.classList.remove('input-error');
}

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
    
    // Verificar ID duplicado antes de enviar
    if (verificarIdDuplicado()) {
        return;
    }
    
    const aluno = {
        nome: document.getElementById('nome').value,
        apelido: document.getElementById('apelido').value,
        curso: parseInt(selectCurso.value),
        anoCurricular: parseInt(document.getElementById('anoCurricular').value),
        idade: parseInt(document.getElementById('idade').value)
    };
    
    const alunoId = document.getElementById('alunoId').value;
    const idFornecido = idInput.value.trim();
    
    // Se estiver criando um novo aluno e foi fornecido um ID, use-o
    if (!alunoId && idFornecido) {
        aluno.id = idFornecido;
    }
    
    const url = alunoId ? `${API_ALUNOS}/${alunoId}` : API_ALUNOS;
    const method = alunoId ? 'PUT' : 'POST';
    
    try {
        const response = await fetch(url, {
            method,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(aluno)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro ${response.status}: ${errorText}`);
        }
        
        const alunoSalvo = await response.json();
        
        // Atualizar cache de IDs
        if (!alunoId && idFornecido) {
            existingIds.add(idFornecido);
        }
        
        // Se estivermos atualizando, remova a linha antiga
        if (alunoId) {
            document.getElementById(`aluno-${alunoId}`).remove();
        }
        
        // Adicione o novo aluno (ou o aluno atualizado) na tabela
        adicionarAlunoNaTabela(alunoSalvo);
        
        // Resetar formulário
        alunoForm.reset();
        document.getElementById('alunoId').value = '';
        idInput.value = '';
        btnCancelar.style.display = 'none';
        btnSalvar.textContent = 'Salvar Aluno';
        idContainer.style.display = 'block';
        resetarErroID();
        
        alert(alunoId ? 'Aluno atualizado com sucesso!' : 'Aluno criado com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar aluno:', error);
        
        // Tratamento especial para erro de ID duplicado
        if (error.message.includes('id already exists')) {
            mostrarErroID('Este ID já está em uso!');
        } else {
            alert(`Erro: ${error.message}`);
        }
    }
});

// Editar aluno
window.editarAluno = async function(id) {
    try {
        const response = await fetch(`${API_ALUNOS}/${id}`);
        if (!response.ok) throw new Error('Aluno não encontrado');
        
        const aluno = await response.json();
        
        // Preencher formulário
        document.getElementById('alunoId').value = aluno.id;
        document.getElementById('nome').value = aluno.nome;
        document.getElementById('apelido').value = aluno.apelido;
        selectCurso.value = aluno.curso;
        document.getElementById('anoCurricular').value = aluno.anoCurricular;
        document.getElementById('idade').value = aluno.idade;
        
        // Ocultar campo de ID durante a edição
        idContainer.style.display = 'none';
        
        // Atualizar UI
        btnSalvar.textContent = 'Atualizar Aluno';
        btnCancelar.style.display = 'inline-block';
        
        // Scroll para o formulário
        alunoForm.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Erro ao carregar aluno para edição:', error);
        alert(`Erro: ${error.message}`);
    }
}

// Excluir aluno
window.excluirAluno = async function(id) {
    if (!confirm('Tem certeza que deseja excluir este aluno permanentemente?')) return;
    
    try {
        const response = await fetch(`${API_ALUNOS}/${id}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}
        });
        
        if (!response.ok) {
            throw new Error('Falha ao excluir aluno');
        }
        
        // Remover da tabela
        const alunoRow = document.getElementById(`aluno-${id}`);
        if (alunoRow) {
            alunoRow.remove();
        }
        
        // Remover do cache de IDs
        existingIds.delete(id);
        
        // Se estava editando este aluno, limpar formulário
        if (document.getElementById('alunoId').value === id) {
            alunoForm.reset();
            document.getElementById('alunoId').value = '';
            btnCancelar.style.display = 'none';
            btnSalvar.textContent = 'Salvar Aluno';
            idContainer.style.display = 'block';
            resetarErroID();
        }
        
        alert('Aluno excluído com sucesso!');
        
    } catch (error) {
        console.error('Erro ao excluir aluno:', error);
        alert(`Erro: ${error.message}`);
    }
}
