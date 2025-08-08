package it.unife.sample.backend.controller;

import it.unife.sample.backend.model.Bolletta;
import it.unife.sample.backend.repository.BollettaRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

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
}