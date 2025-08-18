
package it.unife.sample.backend.controller;

import it.unife.sample.backend.model.Bolletta;
import it.unife.sample.backend.model.Utente;
import it.unife.sample.backend.repository.BollettaRepository;
import it.unife.sample.backend.repository.UtenteRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.time.LocalDate;
import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.math.BigDecimal;
import it.unife.sample.backend.service.UtenteService; // aggiungi l'import


@RestController
@RequestMapping("/api/bollette")
@CrossOrigin(origins = "*")
public class BollettaController {
    // Classe per la richiesta di pagamento (CVV)
    public static class PagamentoRequest {
        private String cvv;
        public String getCvv() { return cvv; }
        public void setCvv(String cvv) { this.cvv = cvv; }
    }
    private final BollettaRepository bollettaRepository;
    private final UtenteRepository utenteRepository;
    private final UtenteService utenteService; // <--- aggiungi questa riga

    public BollettaController(BollettaRepository bollettaRepository, UtenteRepository utenteRepository, UtenteService utenteService) {
        this.bollettaRepository = bollettaRepository;
        this.utenteRepository = utenteRepository;
        this.utenteService = utenteService;
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
public ResponseEntity<Integer> pagaBolletta(@PathVariable Integer id, @RequestBody(required = false) PagamentoRequest pagamentoRequest) {
    Optional<Bolletta> optBolletta = bollettaRepository.findById(id);
    if (optBolletta.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    Bolletta bolletta = optBolletta.get();

    if (pagamentoRequest == null || pagamentoRequest.getCvv() == null || !pagamentoRequest.getCvv().matches("^\\d{3}$")) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    int scontoApplicato = 0;
    Optional<Utente> utenteOpt = utenteRepository.findByCf(bolletta.getCf());
    if (utenteOpt.isPresent()) {
        Utente utente = utenteOpt.get();
        int puntiUtente = utente.getPunti() != null ? utente.getPunti() : 0;
        scontoApplicato = utenteService.calcolaScontoProgressivo(puntiUtente);
        BigDecimal costoOriginale = bolletta.getImporto();
        BigDecimal costoScontato = costoOriginale.multiply(BigDecimal.valueOf(1 - (scontoApplicato / 100.0)));
        bolletta.setImporto(costoScontato);
    }

    bolletta.setDataPagamento(LocalDate.now());
    bollettaRepository.save(bolletta);


    // Logica punti utente
    if (bolletta.getDataPagamento() != null && bolletta.getScadenza() != null && !bolletta.getDataPagamento().isAfter(bolletta.getScadenza())) {
        String cf = bolletta.getCf();
        if (utenteOpt.isPresent()) {
            Utente utente = utenteOpt.get();
            if (utente.getPunti() == null) {
                utente.setPunti(0);
            }
            utente.setPunti(utente.getPunti() + 10);
            long count = bollettaRepository.countBollettePagateInTempo(cf);
            if (count % 3 == 0) {
                utente.setPunti(utente.getPunti() + 30);
            }
            utenteRepository.save(utente);
        }
    }

        return ResponseEntity.ok(scontoApplicato);
    }
}