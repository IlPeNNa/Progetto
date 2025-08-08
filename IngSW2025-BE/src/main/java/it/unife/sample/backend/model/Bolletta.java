package it.unife.sample.backend.model;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "bolletta")
public class Bolletta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_BOLLETTA")
    private Integer idBolletta;

    @Column(name = "SCADENZA")
    private LocalDate scadenza;

    @Column(name = "IMPORTO", precision = 10, scale = 2)
    private BigDecimal importo;

    @Column(name = "TIPOLOGIA", length = 50)
    private String tipologia;

    @Column(name = "DATA_PAGAMENTO")
    private LocalDate dataPagamento;

    @Column(name = "ID_OFFERTA")
    private Integer idOfferta;

    @Column(name = "D_FORNITORE")
    private Integer dFornitore;

    @Column(name = "CF", length = 16)
    private String cf;

    // Getters e setters

    public Integer getIdBolletta() { return idBolletta; }
    public void setIdBolletta(Integer idBolletta) { this.idBolletta = idBolletta; }

    public LocalDate getScadenza() { return scadenza; }
    public void setScadenza(LocalDate scadenza) { this.scadenza = scadenza; }

    public BigDecimal getImporto() { return importo; }
    public void setImporto(BigDecimal importo) { this.importo = importo; }

    public String getTipologia() { return tipologia; }
    public void setTipologia(String tipologia) { this.tipologia = tipologia; }

    public LocalDate getDataPagamento() { return dataPagamento; }
    public void setDataPagamento(LocalDate dataPagamento) { this.dataPagamento = dataPagamento; }

    public Integer getIdOfferta() { return idOfferta; }
    public void setIdOfferta(Integer idOfferta) { this.idOfferta = idOfferta; }

    public Integer getDFornitore() { return dFornitore; }
    public void setDFornitore(Integer dFornitore) { this.dFornitore = dFornitore; }

    public String getCf() { return cf; }
    public void setCf(String cf) { this.cf = cf; }
}