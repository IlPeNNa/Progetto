package it.unife.sample.backend.model;

public class UserSalaryDTO {
    private String cf;
    private double stipendio;

    public String getCf() {
        return cf;
    }
    public void setCf(String cf) {
        this.cf = cf;
    }
    public double getStipendio() {
        return stipendio;
    }
    public void setStipendio(double stipendio) {
        this.stipendio = stipendio;
    }
}
