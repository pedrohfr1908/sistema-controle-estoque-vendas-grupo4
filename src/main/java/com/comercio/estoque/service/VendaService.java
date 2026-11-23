package com.comercio.estoque.service;

import com.comercio.estoque.model.ItemVenda;
import com.comercio.estoque.model.Produto;
import com.comercio.estoque.model.Venda;
import com.comercio.estoque.repository.VendaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class VendaService {
    private final VendaRepository vendaRepository;
    private final ProdutoService produtoService;

    public VendaService(VendaRepository vendaRepository, ProdutoService produtoService) {
        this.vendaRepository = vendaRepository;
        this.produtoService = produtoService;
    }

    public record ItemSolicitado(Long produtoId, int quantidade) {}

    public Venda registrarVenda(String formaPagamento, List<ItemSolicitado> itensSolicitados) {
        if (formaPagamento == null || formaPagamento.isBlank()) {
            throw new IllegalArgumentException("A forma de pagamento é obrigatória.");
        }
        if (itensSolicitados == null || itensSolicitados.isEmpty()) {
            throw new IllegalArgumentException("A venda deve conter ao menos um item.");
        }

        Venda venda = new Venda();
        venda.setFormaPagamento(formaPagamento);
        venda.setDataHora(LocalDateTime.now());

        for (ItemSolicitado req : itensSolicitados) {
            Produto produto = produtoService.buscarPorId(req.produtoId());
            produtoService.baixarEstoqueParaVenda(produto.getId(), req.quantidade());
            ItemVenda item = new ItemVenda(produto, req.quantidade());
            venda.adicionarItem(item);
        }

        return vendaRepository.salvar(venda);
    }

    public List<Venda> listarVendas() {
        return vendaRepository.listarTodas();
    }

    public double calcularFaturamentoTotal() {
        return vendaRepository.listarTodas().stream()
                .mapToDouble(Venda::getValorTotal)
                .sum();
    }
}
