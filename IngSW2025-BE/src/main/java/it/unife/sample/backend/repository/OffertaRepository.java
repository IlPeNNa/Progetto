package it.unife.sample.backend.repository;

import it.unife.sample.backend.model.Offerta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface OffertaRepository extends JpaRepository<Offerta, Integer> {
    @Query("SELECT o FROM Offerta o WHERE o.dataFine >= :oggi")
    List<Offerta> findOfferteValide(@Param("oggi") LocalDate oggi);

    List<Offerta> findByTipo(String tipo);
    List<Offerta> findByDurataMese(Integer durataMese);
    List<Offerta> findByImportoLessThanEqual(BigDecimal importo);
    
    
    @Query("SELECT o FROM Offerta o WHERE o.tipo = :tipo AND o.dataFine >= :oggi ORDER BY o.importo ASC")
    List<Offerta> findSuggeritaPerTipo(@Param("tipo") String tipo, @Param("oggi") LocalDate oggi);
}
