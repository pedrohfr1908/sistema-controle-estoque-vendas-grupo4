package com.comercio.estoque.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class Venda extends EntidadeBase {
    private LocalDateTime dataHora = LocalDateTime.now();
    private String formaPagamento;
    private List<ItemVenda> itens = new ArrayList<>();
    private double valorTotal;

    public Venda() {}

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public String getFormaPagamento() {
        return formaPagamento;
    }

    public void setFormaPagamento(String formaPagamento) {
        this.formaPagamento = formaPagamento;
    }

    public List<ItemVenda> getItens() {
        return itens;
    }

    public void setItens(List<ItemVenda> itens) {
        this.itens = itens;
        recalcularTotal();
    }

    public double getValorTotal() {
        return valorTotal;
    }

    public void adicionarItem(ItemVenda item) {
        this.itens.add(item);
        recalcularTotal();
    }

    public void recalcularTotal() {
        this.valorTotal = this.itens.stream()
                .mapToDouble(ItemVenda::getSubtotal)
                .sum();
    }
}
