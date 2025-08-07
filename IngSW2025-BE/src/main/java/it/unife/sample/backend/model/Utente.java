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

    // Costruttore vuoto
    public Utente() {}

    // Costruttore con parametri
    public Utente(String cf, String mail, String nome, String cognome, Double stipendio, String password) {
        this.cf = cf;
        this.mail = mail;
        this.nome = nome;
        this.cognome = cognome;
        this.stipendio = stipendio;
        this.password = password;
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
}
