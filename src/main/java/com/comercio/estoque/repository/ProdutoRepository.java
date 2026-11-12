package com.comercio.estoque.repository;

import com.comercio.estoque.model.Produto;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class ProdutoRepository {
    private final List<Produto> produtos = new ArrayList<>();
    private final AtomicLong geradorId = new AtomicLong(1);

    public Produto salvar(Produto produto) {
        if (produto.getId() == null) {
            produto.setId(geradorId.getAndIncrement());
            produtos.add(produto);
        }
        return produto;
    }

    public List<Produto> listarTodos() {
        return produtos.stream()
                .filter(Produto::isAtivo)
                .toList();
    }

    public Optional<Produto> buscarPorId(Long id) {
        return produtos.stream()
                .filter(p -> p.getId().equals(id) && p.isAtivo())
                .findFirst();
    }
}
