package com.comercio.estoque.repository;

import com.comercio.estoque.model.Categoria;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class CategoriaRepository {
    private final List<Categoria> categorias = new ArrayList<>();
    private final AtomicLong geradorId = new AtomicLong(1);

    public Categoria salvar(Categoria categoria) {
        if (categoria.getId() == null) {
            categoria.setId(geradorId.getAndIncrement());
            categorias.add(categoria);
        }
        return categoria;
    }

    public List<Categoria> listarTodas() {
        return categorias.stream()
                .filter(Categoria::isAtivo)
                .toList();
    }

    public Optional<Categoria> buscarPorId(Long id) {
        return categorias.stream()
                .filter(c -> c.getId().equals(id) && c.isAtivo())
                .findFirst();
    }
}
