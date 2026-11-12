package com.comercio.estoque.model;

public class Fornecedor extends EntidadeBase {
    private String razaoSocial;
    private String cnpj;
    private String telefone;

    public Fornecedor() {}

    public Fornecedor(String razaoSocial, String cnpj, String telefone) {
        this.razaoSocial = razaoSocial;
        this.cnpj = cnpj;
        this.telefone = telefone;
    }

    public String getRazaoSocial() {
        return razaoSocial;
    }

    public void setRazaoSocial(String razaoSocial) {
        this.razaoSocial = razaoSocial;
    }

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }
}
