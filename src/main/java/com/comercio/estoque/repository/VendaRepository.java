package com.comercio.estoque.repository;

import com.comercio.estoque.model.Venda;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class VendaRepository {
    private final List<Venda> vendas = new ArrayList<>();
    private final AtomicLong geradorId = new AtomicLong(1);

    public Venda salvar(Venda venda) {
        if (venda.getId() == null) {
            venda.setId(geradorId.getAndIncrement());
            vendas.add(venda);
        }
        return venda;
    }

    public List<Venda> listarTodas() {
        return vendas.stream()
                .filter(Venda::isAtivo)
                .toList();
    }

    public Optional<Venda> buscarPorId(Long id) {
        return vendas.stream()
                .filter(v -> v.getId().equals(id) && v.isAtivo())
                .findFirst();
    }
}
