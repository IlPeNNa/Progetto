package it.unife.sample.backend.service;

import it.unife.sample.backend.model.Attiva;
import it.unife.sample.backend.repository.AttivaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AttivaService {
    @Autowired
    private AttivaRepository attivaRepository;

    public List<Attiva> findAll() {
        return attivaRepository.findAll();
    }

    public Attiva save(Attiva attiva) {
        return attivaRepository.save(attiva);
    }

    public List<Attiva> findByCf(String cf) {
        return attivaRepository.findByCf(cf);
    }

    @Transactional
    public void deleteAttivazione(String cf, Integer idOfferta) {
        attivaRepository.deleteByCfAndIdOfferta(cf, idOfferta);
    }
}
