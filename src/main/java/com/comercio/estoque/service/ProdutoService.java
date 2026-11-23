package com.comercio.estoque.service;

import com.comercio.estoque.model.Categoria;
import com.comercio.estoque.model.Fornecedor;
import com.comercio.estoque.model.Produto;
import com.comercio.estoque.repository.ProdutoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProdutoService {
    private final ProdutoRepository repository;
    private final CategoriaService categoriaService;
    private final FornecedorService fornecedorService;

    public ProdutoService(ProdutoRepository repository, CategoriaService categoriaService, FornecedorService fornecedorService) {
        this.repository = repository;
        this.categoriaService = categoriaService;
        this.fornecedorService = fornecedorService;
    }

    public Produto cadastrar(Produto produto, Long categoriaId, Long fornecedorId) {
        if (produto.getNome() == null || produto.getNome().isBlank()) {
            throw new IllegalArgumentException("O nome do produto é obrigatório.");
        }
        if (produto.getPrecoVenda() <= 0) {
            throw new IllegalArgumentException("O preço de venda deve ser maior que zero.");
        }
        if (produto.getQuantidadeEstoque() < 0) {
            throw new IllegalArgumentException("A quantidade inicial não pode ser negativa.");
        }

        Categoria categoria = categoriaService.buscarPorId(categoriaId);
        Fornecedor fornecedor = fornecedorService.buscarPorId(fornecedorId);

        produto.setCategoria(categoria);
        produto.setFornecedor(fornecedor);

        return repository.salvar(produto);
    }

    public List<Produto> listar() {
        return repository.listarTodos();
    }

    public Produto buscarPorId(Long id) {
        return repository.buscarPorId(id)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado."));
    }

    public List<Produto> listarComEstoqueBaixo() {
        return repository.listarTodos().stream()
                .filter(Produto::isEstoqueBaixo)
                .toList();
    }

    public void registrarEntradaEstoque(Long id, int quantidadeAdicional) {
        if (quantidadeAdicional <= 0) {
            throw new IllegalArgumentException("A quantidade de entrada deve ser maior que zero.");
        }
        Produto produto = buscarPorId(id);
        produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() + quantidadeAdicional);
    }

    public void baixarEstoqueParaVenda(Long id, int quantidade) {
        Produto produto = buscarPorId(id);
        produto.baixarEstoque(quantidade);
    }

    public void inativar(Long id) {
        Produto produto = buscarPorId(id);
        produto.setAtivo(false);
    }
}
