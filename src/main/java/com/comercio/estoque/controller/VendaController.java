package com.comercio.estoque.controller;

import com.comercio.estoque.model.Venda;
import com.comercio.estoque.service.VendaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vendas")
public class VendaController {
    private final VendaService service;

    public VendaController(VendaService service) {
        this.service = service;
    }

    public record VendaRequest(String formaPagamento, List<VendaService.ItemSolicitado> itens) {}

    @GetMapping
    public List<Venda> listar() {
        return service.listarVendas();
    }

    @GetMapping("/resumo")
    public Map<String, Object> resumo() {
        List<Venda> vendas = service.listarVendas();
        return Map.of(
                "totalVendas", vendas.size(),
                "faturamentoTotal", service.calcularFaturamentoTotal()
        );
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody VendaRequest request) {
        try {
            Venda salva = service.registrarVenda(request.formaPagamento(), request.itens());
            return ResponseEntity.ok(salva);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
