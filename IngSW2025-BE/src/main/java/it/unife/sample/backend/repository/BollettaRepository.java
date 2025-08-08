package it.unife.sample.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import it.unife.sample.backend.model.Bolletta;
import java.util.List;

public interface BollettaRepository extends JpaRepository<Bolletta, Integer> {
    List<Bolletta> findByCf(String cf);
}