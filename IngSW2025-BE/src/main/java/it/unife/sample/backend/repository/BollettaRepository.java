package it.unife.sample.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import it.unife.sample.backend.model.Bolletta;

public interface BollettaRepository extends JpaRepository<Bolletta, Integer> {
    List<Bolletta> findByCf(String cf);

    // Conta le bollette pagate entro la scadenza per un utente
    @org.springframework.data.jpa.repository.Query("SELECT COUNT(b) FROM Bolletta b WHERE b.cf = :cf AND b.dataPagamento IS NOT NULL AND b.dataPagamento <= b.scadenza")
    long countBollettePagateInTempo(@org.springframework.data.repository.query.Param("cf") String cf);

    @org.springframework.data.jpa.repository.Query("SELECT b FROM Bolletta b WHERE b.cf = :cf AND b.dataPagamento IS NOT NULL AND b.dataPagamento BETWEEN :inizio AND :fine")
    List<Bolletta> findByCfAndDataPagamentoBetweenAndDataPagamentoIsNotNull(@org.springframework.data.repository.query.Param("cf") String cf, @org.springframework.data.repository.query.Param("inizio") java.time.LocalDate inizio, @org.springframework.data.repository.query.Param("fine") java.time.LocalDate fine);
}