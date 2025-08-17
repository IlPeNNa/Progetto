package it.unife.sample.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "utente")
public class Utente {

    @Id
    @Column(name = "CF")
    private String cf;

    @Column(name = "mail")
    private String mail;

    @Column(name = "nome")
    private String nome;

    @Column(name = "cognome")
    private String cognome;

    @Column(name = "stipendio")
    private Double stipendio;

    @Column(name = "password")
    private String password;

        @Column(name = "ultimo_accesso")
        private java.time.LocalDate ultimoAccesso;

        @Column(name = "punti")
        private Integer punti;

    // Costruttore vuoto
    public Utente() {}

    // Costruttore con parametri
        public Utente(String cf, String mail, String nome, String cognome, Double stipendio, String password, java.time.LocalDate ultimoAccesso, Integer punti) {
            this.cf = cf;
            this.mail = mail;
            this.nome = nome;
            this.cognome = cognome;
            this.stipendio = stipendio;
            this.password = password;
            this.ultimoAccesso = ultimoAccesso;
            this.punti = punti;
    }

    // Getters and Setters
    public String getCf() {
        return cf;
    }

    public void setCf(String cf) {
        this.cf = cf;
    }

    public String getMail() {
        return mail;
    }

    public void setMail(String mail) {
        this.mail = mail;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCognome() {
        return cognome;
    }

    public void setCognome(String cognome) {
        this.cognome = cognome;
    }

    public Double getStipendio() {
        return stipendio;
    }

    public void setStipendio(Double stipendio) {
        this.stipendio = stipendio;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

        public java.time.LocalDate getUltimoAccesso() {
            return ultimoAccesso;
        }

        public void setUltimoAccesso(java.time.LocalDate ultimoAccesso) {
            this.ultimoAccesso = ultimoAccesso;
        }

        public Integer getPunti() {
            return punti;
        }

        public void setPunti(Integer punti) {
            this.punti = punti;
        }
}
