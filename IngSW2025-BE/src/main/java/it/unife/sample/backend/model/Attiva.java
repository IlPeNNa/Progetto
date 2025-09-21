package it.unife.sample.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "attiva")
@IdClass(AttivaId.class)
public class Attiva {
    @Id
    @Column(name = "CF")
    private String cf;

    @Id
    @Column(name = "ID_offerta")
    private Integer idOfferta;

    @Column(name = "Data_attivazione")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dataAttivazione;
    // Getters e setters
    public String getCf() { return cf; }
    public void setCf(String cf) { this.cf = cf; }
    public Integer getIdOfferta() { return idOfferta; }
    public void setIdOfferta(Integer idOfferta) { this.idOfferta = idOfferta; }
    public LocalDate getDataAttivazione() { return dataAttivazione; }
    public void setDataAttivazione(LocalDate dataAttivazione) { this.dataAttivazione = dataAttivazione; }
}
