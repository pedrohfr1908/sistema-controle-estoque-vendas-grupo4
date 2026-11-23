const API_CATEGORIAS = '/api/categorias';
const API_FORNECEDORES = '/api/fornecedores';
const API_PRODUTOS = '/api/produtos';
const API_VENDAS = '/api/vendas';

let produtosDisponiveis = [];
let carrinho = [];

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
    await carregarVendas();
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
    produtosDisponiveis = produtos;

    const tbody = document.getElementById('tabela-produtos');
    const selectPdv = document.getElementById('pdv-produto');
    tbody.innerHTML = '';
    selectPdv.innerHTML = '<option value="">Selecione um produto...</option>';
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

        if (p.quantidadeEstoque > 0) {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.textContent = `${p.nome} (R$ ${p.precoVenda.toFixed(2)} | Estoque: ${p.quantidadeEstoque})`;
            selectPdv.appendChild(opt);
        }
    });

    const banner = document.getElementById('alerta-estoque-container');
    if (alertas > 0) {
        document.getElementById('qtd-alertas').textContent = alertas;
        banner.style.display = 'block';
    } else {
        banner.style.display = 'none';
    }
}

function adicionarItemCarrinho() {
    const produtoId = parseInt(document.getElementById('pdv-produto').value);
    const quantidade = parseInt(document.getElementById('pdv-qtd').value);

    if (!produtoId || isNaN(quantidade) || quantidade <= 0) {
        alert('Selecione um produto e informe uma quantidade válida.');
        return;
    }

    const produto = produtosDisponiveis.find(p => p.id === produtoId);
    if (!produto) return;

    const itemExistente = carrinho.find(i => i.produtoId === produtoId);
    const qtdTotalDesejada = (itemExistente ? itemExistente.quantidade : 0) + quantidade;

    if (qtdTotalDesejada > produto.quantidadeEstoque) {
        alert(`Quantidade solicitada (${qtdTotalDesejada}) excede o estoque disponível (${produto.quantidadeEstoque}).`);
        return;
    }

    if (itemExistente) {
        itemExistente.quantidade += quantidade;
    } else {
        carrinho.push({
            produtoId: produto.id,
            nome: produto.nome,
            precoUnitario: produto.precoVenda,
            quantidade
        });
    }

    renderizarCarrinho();
}

function removerItemCarrinho(index) {
    carrinho.splice(index, 1);
    renderizarCarrinho();
}

function renderizarCarrinho() {
    const tbody = document.getElementById('tabela-carrinho');
    tbody.innerHTML = '';
    let total = 0;

    carrinho.forEach((item, index) => {
        const subtotal = item.precoUnitario * item.quantidade;
        total += subtotal;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.nome}</td>
            <td>${item.quantidade}</td>
            <td>R$ ${item.precoUnitario.toFixed(2)}</td>
            <td>R$ ${subtotal.toFixed(2)}</td>
            <td><button class="btn-acao btn-excluir" onclick="removerItemCarrinho(${index})">Remover</button></td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById('pdv-total-valor').textContent = total.toFixed(2);
}

async function finalizarVenda() {
    if (carrinho.length === 0) {
        alert('Adicione pelo menos um produto ao carrinho antes de finalizar.');
        return;
    }

    const formaPagamento = document.getElementById('pdv-forma-pagamento').value;
    const payload = {
        formaPagamento,
        itens: carrinho.map(item => ({
            produtoId: item.produtoId,
            quantidade: item.quantidade
        }))
    };

    const resposta = await fetch(API_VENDAS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (resposta.ok) {
        carrinho = [];
        renderizarCarrinho();
        alert('Venda registrada e estoque atualizado com sucesso!');
        await atualizarTudo();
    } else {
        alert(await resposta.text());
    }
}

async function carregarVendas() {
    const [respVendas, respResumo] = await Promise.all([
        fetch(API_VENDAS),
        fetch(`${API_VENDAS}/resumo`)
    ]);

    const vendas = await respVendas.json();
    const resumo = await respResumo.json();

    document.getElementById('resumo-qtd-vendas').textContent = resumo.totalVendas;
    document.getElementById('resumo-faturamento').textContent = Number(resumo.faturamentoTotal).toFixed(2);

    const tbody = document.getElementById('tabela-vendas');
    tbody.innerHTML = '';

    vendas.forEach(v => {
        const itensDescricao = v.itens
            .map(i => `${i.quantidade}x ${i.produto.nome}`)
            .join(', ');
        const dataFormatada = v.dataHora ? new Date(v.dataHora).toLocaleString('pt-BR') : '-';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${v.id}</td>
            <td>${dataFormatada}</td>
            <td>${itensDescricao}</td>
            <td>${v.formaPagamento}</td>
            <td><strong>R$ ${Number(v.valorTotal).toFixed(2)}</strong></td>
        `;
        tbody.appendChild(tr);
    });
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
