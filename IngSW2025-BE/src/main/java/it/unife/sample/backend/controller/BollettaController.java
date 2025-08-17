
package it.unife.sample.backend.controller;

import it.unife.sample.backend.model.Bolletta;
import it.unife.sample.backend.repository.BollettaRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.time.LocalDate;
import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/bollette")
@CrossOrigin(origins = "*")
public class BollettaController {
    private final BollettaRepository bollettaRepository;

    public BollettaController(BollettaRepository bollettaRepository) {
        this.bollettaRepository = bollettaRepository;
    }

    @GetMapping
    public List<Bolletta> getAllBollette() {
        return bollettaRepository.findAll();
    }

    @GetMapping("/utente/{cf}")
    public List<Bolletta> getBolletteByCf(@PathVariable String cf) {
        return bollettaRepository.findByCf(cf);
    }

    @PatchMapping("/{id}/pagato")
    public ResponseEntity<Bolletta> pagaBolletta(@PathVariable Integer id, @RequestBody(required = false) String ignored) {
        Optional<Bolletta> optBolletta = bollettaRepository.findById(id);
        if (optBolletta.isPresent()) {
            Bolletta bolletta = optBolletta.get();
            bolletta.setDataPagamento(LocalDate.now());
            bollettaRepository.save(bolletta);

                // Logica punti utente
                if (bolletta.getDataPagamento() != null && bolletta.getScadenza() != null && !bolletta.getDataPagamento().isAfter(bolletta.getScadenza())) {
                    String cf = bolletta.getCf();
                    // Recupera utente
                    Optional<Utente> utenteOpt = utenteRepository.findByCf(cf);
                    if (utenteOpt.isPresent()) {
                        Utente utente = utenteOpt.get();
                        // Inizializza punti a 0 se null
                        if (utente.getPunti() == null) {
                            utente.setPunti(0);
                        }
                        // Aggiungi 10 punti
                        utente.setPunti(utente.getPunti() + 10);
                        // Conta bollette pagate puntualmente
                        long count = bollettaRepository.countBollettePagateInTempo(cf);
                        if (count % 3 == 0) {
                            utente.setPunti(utente.getPunti() + 30);
                        }
                        utenteRepository.save(utente);
                    }
                }
            return ResponseEntity.ok(bolletta);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}