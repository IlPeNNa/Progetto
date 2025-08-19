package it.unife.sample.backend.repository;

import it.unife.sample.backend.model.Fornitore;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FornitoreRepository extends JpaRepository<Fornitore, Integer> {
}
