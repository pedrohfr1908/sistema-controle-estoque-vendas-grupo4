package com.comercio.estoque.controller;

import com.comercio.estoque.model.Produto;
import com.comercio.estoque.service.ProdutoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {
    private final ProdutoService service;

    public ProdutoController(ProdutoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Produto> listar() {
        return service.listar();
    }

    @GetMapping("/alertas")
    public List<Produto> listarAlertas() {
        return service.listarComEstoqueBaixo();
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody ProdutoRequest request) {
        try {
            Produto produto = new Produto();
            produto.setNome(request.nome());
            produto.setPrecoVenda(request.precoVenda());
            produto.setQuantidadeEstoque(request.quantidadeEstoque());
            produto.setEstoqueMinimo(request.estoqueMinimo());

            Produto salvo = service.cadastrar(produto, request.categoriaId(), request.fornecedorId());
            return ResponseEntity.ok(salvo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/entrada")
    public ResponseEntity<?> registrarEntrada(@PathVariable Long id, @RequestParam int quantidade) {
        try {
            service.registrarEntradaEstoque(id, quantidade);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> remover(@PathVariable Long id) {
        try {
            service.inativar(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    public record ProdutoRequest(
            String nome,
            double precoVenda,
            int quantidadeEstoque,
            int estoqueMinimo,
            Long categoriaId,
            Long fornecedorId
    ) {}
}
