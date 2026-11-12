const API_CATEGORIAS = '/api/categorias';
const API_FORNECEDORES = '/api/fornecedores';
const API_PRODUTOS = '/api/produtos';

document.addEventListener('DOMContentLoaded', () => {
    atualizarTudo();

    document.getElementById('form-categoria').addEventListener('submit', async (e) => {
        e.preventDefault();
        const nome = document.getElementById('cat-nome').value;
        const descricao = document.getElementById('cat-desc').value;

        const resposta = await fetch(API_CATEGORIAS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, descricao })
        });

        if (resposta.ok) {
            document.getElementById('form-categoria').reset();
            atualizarTudo();
        } else {
            alert(await resposta.text());
        }
    });

    document.getElementById('form-fornecedor').addEventListener('submit', async (e) => {
        e.preventDefault();
        const razaoSocial = document.getElementById('forn-razao').value;
        const cnpj = document.getElementById('forn-cnpj').value;
        const telefone = document.getElementById('forn-tel').value;

        const resposta = await fetch(API_FORNECEDORES, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ razaoSocial, cnpj, telefone })
        });

        if (resposta.ok) {
            document.getElementById('form-fornecedor').reset();
            atualizarTudo();
        } else {
            alert(await resposta.text());
        }
    });

    document.getElementById('form-produto').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            nome: document.getElementById('prod-nome').value,
            precoVenda: parseFloat(document.getElementById('prod-preco').value),
            quantidadeEstoque: parseInt(document.getElementById('prod-qtd').value),
            estoqueMinimo: parseInt(document.getElementById('prod-min').value),
            categoriaId: parseInt(document.getElementById('prod-categoria').value),
            fornecedorId: parseInt(document.getElementById('prod-fornecedor').value)
        };

        const resposta = await fetch(API_PRODUTOS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (resposta.ok) {
            document.getElementById('form-produto').reset();
            atualizarTudo();
        } else {
            alert(await resposta.text());
        }
    });
});

function mostrarSecao(secao) {
    document.querySelectorAll('.secao').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById(`sec-${secao}`).style.display = 'block';
    document.getElementById(`btn-${secao}`).classList.add('active');
}

async function atualizarTudo() {
    await carregarCategorias();
    await carregarFornecedores();
    await carregarProdutos();
}

async function carregarCategorias() {
    const resposta = await fetch(API_CATEGORIAS);
    const categorias = await resposta.json();

    const tbody = document.getElementById('tabela-categorias');
    const select = document.getElementById('prod-categoria');
    tbody.innerHTML = '';
    select.innerHTML = '<option value="">Selecione a Categoria...</option>';

    categorias.forEach(cat => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${cat.id}</td>
            <td>${cat.nome}</td>
            <td>${cat.descricao || '-'}</td>
            <td><button class="btn-acao btn-excluir" onclick="removerEntidade('${API_CATEGORIAS}', ${cat.id})">Excluir</button></td>
        `;
        tbody.appendChild(tr);

        const opt = document.createElement('option');
        opt.value = cat.id;
        opt.textContent = cat.nome;
        select.appendChild(opt);
    });
}

async function carregarFornecedores() {
    const resposta = await fetch(API_FORNECEDORES);
    const fornecedores = await resposta.json();

    const tbody = document.getElementById('tabela-fornecedores');
    const select = document.getElementById('prod-fornecedor');
    tbody.innerHTML = '';
    select.innerHTML = '<option value="">Selecione o Fornecedor...</option>';

    fornecedores.forEach(f => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${f.id}</td>
            <td>${f.razaoSocial}</td>
            <td>${f.cnpj}</td>
            <td>${f.telefone || '-'}</td>
            <td><button class="btn-acao btn-excluir" onclick="removerEntidade('${API_FORNECEDORES}', ${f.id})">Excluir</button></td>
        `;
        tbody.appendChild(tr);

        const opt = document.createElement('option');
        opt.value = f.id;
        opt.textContent = f.razaoSocial;
        select.appendChild(opt);
    });
}

async function carregarProdutos() {
    const resposta = await fetch(API_PRODUTOS);
    const produtos = await resposta.json();

    const tbody = document.getElementById('tabela-produtos');
    tbody.innerHTML = '';
    let alertas = 0;

    produtos.forEach(p => {
        if (p.estoqueBaixo) alertas++;
        const badge = p.estoqueBaixo
            ? '<span class="badge badge-baixo">Estoque Baixo</span>'
            : '<span class="badge badge-ok">Normal</span>';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${p.id}</td>
            <td><strong>${p.nome}</strong></td>
            <td>${p.categoria ? p.categoria.nome : '-'}</td>
            <td>${p.fornecedor ? p.fornecedor.razaoSocial : '-'}</td>
            <td>R$ ${p.precoVenda.toFixed(2)}</td>
            <td>${p.quantidadeEstoque} / ${p.estoqueMinimo}</td>
            <td>${badge}</td>
            <td>
                <button class="btn-acao btn-entrada" onclick="registrarEntrada(${p.id})" title="Dar entrada no estoque">+ Estoque</button>
                <button class="btn-acao btn-excluir" onclick="removerEntidade('${API_PRODUTOS}', ${p.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    const banner = document.getElementById('alerta-estoque-container');
    if (alertas > 0) {
        document.getElementById('qtd-alertas').textContent = alertas;
        banner.style.display = 'block';
    } else {
        banner.style.display = 'none';
    }
}

async function registrarEntrada(id) {
    const qtd = prompt('Informe a quantidade de itens que entraram no estoque:');
    if (qtd && !isNaN(qtd) && parseInt(qtd) > 0) {
        const resposta = await fetch(`${API_PRODUTOS}/${id}/entrada?quantidade=${parseInt(qtd)}`, {
            method: 'PATCH'
        });
        if (resposta.ok) {
            atualizarTudo();
        } else {
            alert(await resposta.text());
        }
    }
}

async function removerEntidade(endpoint, id) {
    await fetch(`${endpoint}/${id}`, { method: 'DELETE' });
    atualizarTudo();
}
