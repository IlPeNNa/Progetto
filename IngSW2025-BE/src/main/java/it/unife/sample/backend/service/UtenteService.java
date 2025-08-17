package it.unife.sample.backend.service;

import it.unife.sample.backend.model.Utente;
import it.unife.sample.backend.repository.UtenteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UtenteService {

    private final UtenteRepository repo;

    public UtenteService(UtenteRepository repo) {
        this.repo = repo;
    }

    // Recupera tutti gli utenti
    public List<Utente> getAllUtenti() {
        return repo.findAll();
    }

    // Recupera utente per CF
    public Optional<Utente> getUtenteByCf(String cf) {
        return repo.findByCf(cf);
    }

    // Recupera utenti per nome
    public List<Utente> getUtentiByNome(String nome) {
        return repo.findByNome(nome);
    }

    // Recupera utenti per cognome
    public List<Utente> getUtentiByCognome(String cognome) {
        return repo.findByCognome(cognome);
    }

    // Recupera utenti per nome e cognome
    public List<Utente> getUtentiByNomeAndCognome(String nome, String cognome) {
        return repo.findByNomeAndCognome(nome, cognome);
    }

    // Recupera utenti con stipendio maggiore di un valore
    public List<Utente> getUtentiByStipendioMaggioreDi(Double stipendio) {
        return repo.findByStipendioGreaterThan(stipendio);
    }

    // Recupera utenti con stipendio in un range
    public List<Utente> getUtentiByStipendioRange(Double minStipendio, Double maxStipendio) {
        return repo.findByStipendioRange(minStipendio, maxStipendio);
    }

    // Crea nuovo utente
    public Utente createUtente(Utente utente) {
        return repo.save(utente);
    }

    // Aggiorna utente esistente
    public Optional<Utente> updateUtente(String cf, Utente utenteAggiornato) {
        return repo.findByCf(cf)
                .map(utente -> {
                    utente.setNome(utenteAggiornato.getNome());
                    utente.setCognome(utenteAggiornato.getCognome());
                    utente.setStipendio(utenteAggiornato.getStipendio());
                    utente.setPassword(utenteAggiornato.getPassword());
                    return repo.save(utente);
                });
    }

    // Elimina utente
    public boolean deleteUtente(String cf) {
        if (repo.existsById(cf)) {
            repo.deleteById(cf);
            return true;
        }
        return false;
    }

    // Login con mail e password
    public Optional<Utente> login(String mail, String password) {
        return repo.findByMailAndPassword(mail, password);
    }

    // Verifica se il login è valido
    public boolean isValidLogin(String mail, String password) {
        return repo.findByMailAndPassword(mail, password).isPresent();
    }

        // Aggiorna accesso e punti se nuovo giorno
        public Optional<Utente> aggiornaAccesso(String cf) {
            Optional<Utente> utenteOpt = repo.findByCf(cf);
            if (utenteOpt.isPresent()) {
                Utente utente = utenteOpt.get();
                java.time.LocalDate oggi = java.time.LocalDate.now();
                if (utente.getUltimoAccesso() == null || !utente.getUltimoAccesso().isEqual(oggi)) {
                    utente.setUltimoAccesso(oggi);
                    utente.setPunti(utente.getPunti() == null ? 1 : utente.getPunti() + 1);
                    repo.save(utente);
                }
                return Optional.of(utente);
            }
            return Optional.empty();
        }
}
