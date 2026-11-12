package com.comercio.estoque.repository;

import com.comercio.estoque.model.Fornecedor;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class FornecedorRepository {
    private final List<Fornecedor> fornecedores = new ArrayList<>();
    private final AtomicLong geradorId = new AtomicLong(1);

    public Fornecedor salvar(Fornecedor fornecedor) {
        if (fornecedor.getId() == null) {
            fornecedor.setId(geradorId.getAndIncrement());
            fornecedores.add(fornecedor);
        }
        return fornecedor;
    }

    public List<Fornecedor> listarTodos() {
        return fornecedores.stream()
                .filter(Fornecedor::isAtivo)
                .toList();
    }

    public Optional<Fornecedor> buscarPorId(Long id) {
        return fornecedores.stream()
                .filter(f -> f.getId().equals(id) && f.isAtivo())
                .findFirst();
    }
}
