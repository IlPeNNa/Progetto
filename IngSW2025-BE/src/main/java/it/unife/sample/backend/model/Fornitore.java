

package it.unife.sample.backend.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "fornitore")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Fornitore {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "D_FORNITORE")
    private Integer dFornitore;

    @Column(name = "nome")
    private String nome;

    @Column(name = "telefono")
    private String telefono;

    @OneToMany(mappedBy = "fornitore")
    @JsonBackReference
    private List<Offerta> offerte;

    public Fornitore() {}

    // Getters e setters
    public Integer getDFornitore() { return dFornitore; }
    public void setDFornitore(Integer dFornitore) { this.dFornitore = dFornitore; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public List<Offerta> getOfferte() { return offerte; }
    public void setOfferte(List<Offerta> offerte) { this.offerte = offerte; }
}