package com.comercio.estoque.service;

import com.comercio.estoque.model.Fornecedor;
import com.comercio.estoque.repository.FornecedorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FornecedorService {
    private final FornecedorRepository repository;

    public FornecedorService(FornecedorRepository repository) {
        this.repository = repository;
    }

    public Fornecedor cadastrar(Fornecedor fornecedor) {
        if (fornecedor.getRazaoSocial() == null || fornecedor.getRazaoSocial().isBlank()) {
            throw new IllegalArgumentException("A razão social do fornecedor é obrigatória.");
        }
        if (fornecedor.getCnpj() == null || fornecedor.getCnpj().isBlank()) {
            throw new IllegalArgumentException("O CNPJ do fornecedor é obrigatório.");
        }
        return repository.salvar(fornecedor);
    }

    public List<Fornecedor> listar() {
        return repository.listarTodos();
    }

    public Fornecedor buscarPorId(Long id) {
        return repository.buscarPorId(id)
                .orElseThrow(() -> new IllegalArgumentException("Fornecedor não encontrado."));
    }

    public void inativar(Long id) {
        Fornecedor fornecedor = buscarPorId(id);
        fornecedor.setAtivo(false);
    }
}
