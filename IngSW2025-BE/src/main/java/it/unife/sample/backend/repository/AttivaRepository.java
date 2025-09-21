package it.unife.sample.backend.repository;

import it.unife.sample.backend.model.Attiva;
import it.unife.sample.backend.model.AttivaId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttivaRepository extends JpaRepository<Attiva, AttivaId> {
    List<Attiva> findByCf(String cf);
    
    @Modifying
    void deleteByCfAndIdOfferta(String cf, Integer idOfferta);
}
