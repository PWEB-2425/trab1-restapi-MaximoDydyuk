// URLs da API
const API_ALUNOS = 'http://localhost:5000/api/alunos';
const API_CURSOS = 'http://localhost:5000/api/cursos';

// Elementos DOM
const alunoForm = document.getElementById('alunoForm');
const tabelaAlunos = document.getElementById('tabelaAlunos').querySelector('tbody');
const btnSalvar = document.getElementById('btnSalvar');
const btnCancelar = document.getElementById('btnCancelar');

// Carregar dados iniciais
document.addEventListener('DOMContentLoaded', async () => {
    await carregarAlunos();
    
    btnCancelar.addEventListener('click', () => {
        alunoForm.reset();
        document.getElementById('alunoId').value = '';
        btnCancelar.style.display = 'none';
        btnSalvar.textContent = 'Salvar Aluno';
    });
});

// Carregar alunos para a tabela
async function carregarAlunos() {
    try {
        const response = await fetch(API_ALUNOS);
        if (!response.ok) throw new Error('Erro ao carregar alunos');
        
        const result = await response.json();
        
        // Acesse o array de alunos corretamente
        const alunos = result.data || result;
        
        tabelaAlunos.innerHTML = '';
        
        if (Array.isArray(alunos)) {
            alunos.forEach(aluno => adicionarAlunoNaTabela(aluno));
        } else {
            throw new Error('Resposta inválida da API');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar alunos: ' + error.message);
    }
}

// Adicionar aluno na tabela
function adicionarAlunoNaTabela(aluno) {
    const tr = document.createElement('tr');
    tr.id = `aluno-${aluno._id || aluno.id}`;
    
    tr.innerHTML = `
        <td>${aluno._id || aluno.id}</td>
        <td>${aluno.nome}</td>
        <td>${aluno.apelido}</td>
        <td>${aluno.curso}</td>
        <td>${aluno.anocurricular}</td>
        <td>${aluno.idade}</td>
        <td class="action-buttons">
            <button class="btn-editar" onclick="editarAluno('${aluno._id || aluno.id}')">Editar</button>
            <button class="btn-excluir" onclick="excluirAluno('${aluno._id || aluno.id}')">Excluir</button>
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
        curso: document.getElementById('curso').value,
        anocurricular: parseInt(document.getElementById('anoCurricular').value),
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
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro ${response.status}: ${errorText}`);
        }
        
        const alunoSalvo = await response.json();
        
        if (alunoId) {
            document.getElementById(`aluno-${alunoId}`).remove();
        }
        
        adicionarAlunoNaTabela(alunoSalvo);
        
        alunoForm.reset();
        document.getElementById('alunoId').value = '';
        btnCancelar.style.display = 'none';
        btnSalvar.textContent = 'Salvar Aluno';
        
        alert(alunoId ? 'Aluno atualizado com sucesso!' : 'Aluno criado com sucesso!');
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
        
        document.getElementById('alunoId').value = id;
        document.getElementById('nome').value = aluno.nome;
        document.getElementById('apelido').value = aluno.apelido;
        document.getElementById('curso').value = aluno.curso;
        document.getElementById('anoCurricular').value = aluno.anocurricular;
        document.getElementById('idade').value = aluno.idade;
        
        btnSalvar.textContent = 'Atualizar Aluno';
        btnCancelar.style.display = 'inline-block';
        
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
        
        const alunoRow = document.getElementById(`aluno-${id}`);
        if (alunoRow) {
            alunoRow.remove();
        }
        
        if (document.getElementById('alunoId').value === id) {
            alunoForm.reset();
            document.getElementById('alunoId').value = '';
            btnCancelar.style.display = 'none';
            btnSalvar.textContent = 'Salvar Aluno';
        }
        
        alert('Aluno excluído com sucesso!');
        
    } catch (error) {
        console.error('Erro ao excluir aluno:', error);
        alert(`Erro: ${error.message}`);
    }
}
