package it.unife.sample.backend.repository;

import it.unife.sample.backend.model.Utente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UtenteRepository extends JpaRepository<Utente, String> {
    
    // Trova utente per CF (chiave primaria)
    Optional<Utente> findByCf(String cf);
    
    // Trova utenti per nome
    List<Utente> findByNome(String nome);
    
    // Trova utenti per cognome
    List<Utente> findByCognome(String cognome);
    
    // Trova utenti per nome e cognome
    List<Utente> findByNomeAndCognome(String nome, String cognome);
    
    // Trova utenti con stipendio maggiore di un valore
    List<Utente> findByStipendioGreaterThan(Double stipendio);
    
    // Query personalizzata per trovare utenti con stipendio in un range
    @Query("SELECT u FROM Utente u WHERE u.stipendio BETWEEN :minStipendio AND :maxStipendio")
    List<Utente> findByStipendioRange(@Param("minStipendio") Double minStipendio, @Param("maxStipendio") Double maxStipendio);
    
    // Trova utente per login (mail e password)
    Optional<Utente> findByMailAndPassword(String mail, String password);
}
