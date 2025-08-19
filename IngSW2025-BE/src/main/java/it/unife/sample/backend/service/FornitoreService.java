package it.unife.sample.backend.service;

import it.unife.sample.backend.model.Fornitore;
import it.unife.sample.backend.repository.FornitoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FornitoreService {
    @Autowired
    private FornitoreRepository fornitoreRepository;

    public List<Fornitore> getAllFornitori() {
        return fornitoreRepository.findAll();
    }
}
