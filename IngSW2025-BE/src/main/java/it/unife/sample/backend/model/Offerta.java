package it.unife.sample.backend.model;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "offerta")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Offerta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_OFFERTA")
    private Integer idOfferta;

    @Column(name = "descrizione")
    private String descrizione;

    @Column(name = "DATA_INIZIO")
    private LocalDate dataInizio;

    @Column(name = "DATA_FINE")
    private LocalDate dataFine;

    @Column(name = "IMPORTO", precision = 10, scale = 2)
    private BigDecimal importo;

    @Column(name = "tipo")
    private String tipo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "D_FORNITORE")
    @JsonManagedReference
    private Fornitore fornitore;

    @Column(name = "durata_mese")
    private Integer durataMese;


    // Getters e setters
    public Integer getIdOfferta() { return idOfferta; }
    public void setIdOfferta(Integer idOfferta) { this.idOfferta = idOfferta; }
    public String getDescrizione() { return descrizione; }
    public void setDescrizione(String descrizione) { this.descrizione = descrizione; }
    public LocalDate getDataInizio() { return dataInizio; }
    public void setDataInizio(LocalDate dataInizio) { this.dataInizio = dataInizio; }
    public LocalDate getDataFine() { return dataFine; }
    public void setDataFine(LocalDate dataFine) { this.dataFine = dataFine; }
    public BigDecimal getImporto() { return importo; }
    public void setImporto(BigDecimal importo) { this.importo = importo; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public Fornitore getFornitore() { return fornitore; }
    public void setFornitore(Fornitore fornitore) { this.fornitore = fornitore; }
    public Integer getDurataMese() { return durataMese; }
    public void setDurataMese(Integer durataMese) { this.durataMese = durataMese; }
}
