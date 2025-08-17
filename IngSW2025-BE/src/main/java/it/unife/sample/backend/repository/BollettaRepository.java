package it.unife.sample.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import it.unife.sample.backend.model.Bolletta;
import java.util.List;

public interface BollettaRepository extends JpaRepository<Bolletta, Integer> {
    List<Bolletta> findByCf(String cf);

    // Conta le bollette pagate entro la scadenza per un utente
    @org.springframework.data.jpa.repository.Query("SELECT COUNT(b) FROM Bolletta b WHERE b.cf = :cf AND b.dataPagamento IS NOT NULL AND b.dataPagamento <= b.scadenza")
    long countBollettePagateInTempo(@org.springframework.data.repository.query.Param("cf") String cf);
}