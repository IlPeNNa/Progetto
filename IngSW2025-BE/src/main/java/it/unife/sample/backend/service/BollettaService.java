package it.unife.sample.backend.service;

import it.unife.sample.backend.model.Bolletta;
import it.unife.sample.backend.repository.BollettaRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BollettaService {
    private final BollettaRepository bollettaRepository;

    public BollettaService(BollettaRepository bollettaRepository) {
        this.bollettaRepository = bollettaRepository;
    }

    public List<Bolletta> getAllBollette() {
        return bollettaRepository.findAll();
    }

    public List<Bolletta> getBolletteByCf(String cf) {
        return bollettaRepository.findByCf(cf);
    }
}