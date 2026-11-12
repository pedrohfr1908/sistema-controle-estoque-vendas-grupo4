package com.comercio.estoque.service;

import com.comercio.estoque.model.Categoria;
import com.comercio.estoque.repository.CategoriaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaService {
    private final CategoriaRepository repository;

    public CategoriaService(CategoriaRepository repository) {
        this.repository = repository;
    }

    public Categoria cadastrar(Categoria categoria) {
        if (categoria.getNome() == null || categoria.getNome().isBlank()) {
            throw new IllegalArgumentException("O nome da categoria é obrigatório.");
        }
        return repository.salvar(categoria);
    }

    public List<Categoria> listar() {
        return repository.listarTodas();
    }

    public Categoria buscarPorId(Long id) {
        return repository.buscarPorId(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada."));
    }

    public void inativar(Long id) {
        Categoria categoria = buscarPorId(id);
        categoria.setAtivo(false);
    }
}
