package it.unife.sample.backend.service;

import it.unife.sample.backend.model.UserSalaryDTO;
import it.unife.sample.backend.model.Bolletta;
import it.unife.sample.backend.repository.BollettaRepository;
import it.unife.sample.backend.model.Utente;
import it.unife.sample.backend.repository.UtenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Arrays;
import java.math.BigDecimal;

@Service
public class UserSalaryService {
    @Autowired
    private BollettaRepository bollettaRepository;

    @Autowired
    private UtenteRepository utenteRepository;

    private final String mockoonUrl = "http://localhost:3000/user-salary"; // Adatta la porta se necessario

    public double getStipendioNetto(String cf) {
        RestTemplate restTemplate = new RestTemplate();
        UserSalaryDTO[] salaries = restTemplate.getForObject(mockoonUrl, UserSalaryDTO[].class);
        if (salaries == null) {
            throw new RuntimeException("Nessun dato stipendio ricevuto dal servizio esterno");
        }
        UserSalaryDTO userSalary = Arrays.stream(salaries)
            .filter(s -> s.getCf().equals(cf))
            .findFirst()
            .orElse(null);
        if (userSalary == null) {
            throw new RuntimeException("Dati utente non trovati o codice fiscale errato");
        }
        // Aggiorna lo stipendio dell'utente nel DB
        Utente utente = utenteRepository.findByCf(cf).orElse(null);
        if (utente != null) {
            utente.setStipendio(userSalary.getStipendio());
            utenteRepository.save(utente);
        }

        // Paga tutte le bollette non pagate
        List<Bolletta> bolletteNonPagate = bollettaRepository.findByCfAndDataPagamentoIsNull(cf);
        BigDecimal totaleBollette = BigDecimal.ZERO;
        java.time.LocalDate oggi = java.time.LocalDate.now();
        for (Bolletta b : bolletteNonPagate) {
            totaleBollette = totaleBollette.add(b.getImporto());
            b.setDataPagamento(oggi);
            bollettaRepository.save(b);
        }

        return BigDecimal.valueOf(userSalary.getStipendio()).subtract(totaleBollette).doubleValue();
    }
}
