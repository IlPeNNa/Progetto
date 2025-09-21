package it.unife.sample.backend.model;

import java.io.Serializable;
import java.util.Objects;

public class AttivaId implements Serializable {
    private String cf;
    private Integer idOfferta;

    // Costruttori
    public AttivaId() {}

    public AttivaId(String cf, Integer idOfferta) {
        this.cf = cf;
        this.idOfferta = idOfferta;
    }

    // Getters e setters
    public String getCf() { return cf; }
    public void setCf(String cf) { this.cf = cf; }
    public Integer getIdOfferta() { return idOfferta; }
    public void setIdOfferta(Integer idOfferta) { this.idOfferta = idOfferta; }

    // equals e hashCode (obbligatori per IdClass)
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AttivaId attivaId = (AttivaId) o;
        return Objects.equals(cf, attivaId.cf) && Objects.equals(idOfferta, attivaId.idOfferta);
    }

    @Override
    public int hashCode() {
        return Objects.hash(cf, idOfferta);
    }
}