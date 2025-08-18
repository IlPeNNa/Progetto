package it.unife.sample.backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import it.unife.sample.backend.model.Utente;
import it.unife.sample.backend.service.UtenteService;

@RestController
@RequestMapping("/api/utenti")
@CrossOrigin(origins = "http://localhost:4200") // Permette le richieste dal frontend Angular
public class UtenteController {

    @Autowired
    private UtenteService utenteService;

    // GET - Recupera tutti gli utenti
    @GetMapping
    public ResponseEntity<List<Utente>> getAllUtenti() {
        List<Utente> utenti = utenteService.getAllUtenti();
        return ResponseEntity.ok(utenti);
    }

    // GET - Recupera utente per CF
    @GetMapping("/{cf}")
    public ResponseEntity<Utente> getUtenteByCf(@PathVariable String cf) {
        Optional<Utente> utente = utenteService.getUtenteByCf(cf);
        return utente.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    // POST - Crea nuovo utente (registrazione)
    @PostMapping
    public ResponseEntity<Utente> createUtente(@RequestBody Utente utente) {
        try {
            Utente nuovoUtente = utenteService.createUtente(utente);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuovoUtente);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // POST - Login con mail e password
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        Optional<Utente> utente = utenteService.login(loginRequest.getMail(), loginRequest.getPassword());
        
        if (utente.isPresent()) {
            LoginResponse response = new LoginResponse(true, "Login successful", utente.get());
            return ResponseEntity.ok(response);
        } else {
            LoginResponse response = new LoginResponse(false, "Invalid email or password", null);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    // PUT - Aggiorna utente
    @PutMapping("/{cf}")
    public ResponseEntity<Utente> updateUtente(@PathVariable String cf, @RequestBody Utente utente) {
        Optional<Utente> utenteAggiornato = utenteService.updateUtente(cf, utente);
        return utenteAggiornato.map(ResponseEntity::ok)
                              .orElse(ResponseEntity.notFound().build());
    }

    // DELETE - Elimina utente
    @DeleteMapping("/{cf}")
    public ResponseEntity<Void> deleteUtente(@PathVariable String cf) {
        boolean eliminato = utenteService.deleteUtente(cf);
        return eliminato ? ResponseEntity.noContent().build() 
                        : ResponseEntity.notFound().build();
    }

    // PUT - Aggiorna accesso e punti se nuovo giorno
    @PutMapping("/{cf}/accesso")
    public ResponseEntity<Utente> aggiornaAccesso(@PathVariable String cf) {
        Optional<Utente> utenteOpt = utenteService.aggiornaAccesso(cf);
        return utenteOpt.map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{cf}/sconto")
    public ResponseEntity<Integer> getScontoUtente(@PathVariable String cf) {
        Optional<Utente> utenteOpt = utenteService.getUtenteByCf(cf);
        if (utenteOpt.isPresent()) {
            int punti = utenteOpt.get().getPunti() != null ? utenteOpt.get().getPunti() : 0;
            int sconto = utenteService.calcolaScontoProgressivo(punti);
            return ResponseEntity.ok(sconto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Classe interna per la richiesta di login
    public static class LoginRequest {
        private String mail;
        private String password;

        public LoginRequest() {}

        public LoginRequest(String mail, String password) {
            this.mail = mail;
            this.password = password;
        }

        public String getMail() {
            return mail;
        }

        public void setMail(String mail) {
            this.mail = mail;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    // Classe interna per la risposta di login
    public static class LoginResponse {
        private boolean success;
        private String message;
        private Utente utente;

        public LoginResponse() {}

        public LoginResponse(boolean success, String message, Utente utente) {
            this.success = success;
            this.message = message;
            this.utente = utente;
        }

        public boolean isSuccess() {
            return success;
        }

        public void setSuccess(boolean success) {
            this.success = success;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public Utente getUtente() {
            return utente;
        }

        public void setUtente(Utente utente) {
            this.utente = utente;
        }
    }
}
