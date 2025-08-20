package it.unife.sample.backend.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping; // aggiungi l'import
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import it.unife.sample.backend.model.Bolletta;
import it.unife.sample.backend.model.Utente;
import it.unife.sample.backend.repository.BollettaRepository;
import it.unife.sample.backend.repository.UtenteRepository;
import it.unife.sample.backend.service.UtenteService;


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

    @GetMapping("/statistiche")
    public ResponseEntity<?> getStatistichePagamenti(@RequestParam String cf, @RequestParam String dataInizio, @RequestParam String dataFine) {
        LocalDate inizio = LocalDate.parse(dataInizio);
        LocalDate fine = LocalDate.parse(dataFine);
        // Recupera solo bollette pagate
    List<Bolletta> bollettePagate = bollettaRepository.findByCfAndDataPagamentoBetweenAndDataPagamentoIsNotNull(cf, inizio, fine);

        // Calcola spese per tipologia
        java.util.Map<String, Double> spesePerTipologia = new java.util.HashMap<>();
        double totale = 0;
        for (Bolletta b : bollettePagate) {
            String tipo = b.getTipologia();
            double imp = b.getImporto().doubleValue();
            spesePerTipologia.put(tipo, spesePerTipologia.getOrDefault(tipo, 0.0) + imp);
            totale += imp;
        }

        java.util.Map<String, Object> result = new java.util.HashMap<>();
        result.put("bollettePagate", bollettePagate);
        result.put("spesePerTipologia", spesePerTipologia);
        result.put("totale", totale);
        return ResponseEntity.ok(result);
    }
}