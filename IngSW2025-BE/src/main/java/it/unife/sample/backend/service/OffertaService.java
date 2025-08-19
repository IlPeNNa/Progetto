package it.unife.sample.backend.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.unife.sample.backend.model.Offerta;
import it.unife.sample.backend.repository.OffertaRepository;

@Service
public class OffertaService {
    @Autowired
    private OffertaRepository offertaRepository;

    public List<Offerta> getAllOfferte() {
        return offertaRepository.findAll();
    }

    public List<Offerta> filtraOfferte(String tipo, Integer durataMese, BigDecimal prezzoMax) {
    List<Offerta> offerte = offertaRepository.findOfferteValide(LocalDate.now());
    System.out.println("Offerte trovate: " + offerte.size());
    for (Offerta o : offerte) {
        System.out.println("ID: " + o.getIdOfferta() + ", dataFine: " + o.getDataFine());
    }
        if (tipo != null) {
            offerte = offerte.stream().filter(o -> o.getTipo().equalsIgnoreCase(tipo)).toList();
        }
        if (durataMese != null) {
            offerte = offerte.stream().filter(o -> o.getDurataMese() != null && o.getDurataMese().equals(durataMese)).toList();
        }
        if (prezzoMax != null) {
            offerte = offerte.stream().filter(o -> o.getImporto().compareTo(prezzoMax) <= 0).toList();
        }
        return offerte;
    }

    public Offerta getOffertaSuggerita(String tipo, BigDecimal consumoMedio) {
        // Logica: restituisci l'offerta valida con prezzo più basso per il tipo richiesto
        List<Offerta> offerte = offertaRepository.findSuggeritaPerTipo(tipo, LocalDate.now());
        if (offerte.isEmpty()) return null;
        return offerte.get(0);
    }

        public Offerta attivaOfferta(Integer id) {
            Offerta offerta = offertaRepository.findById(id).orElse(null);
            if (offerta != null) {
                offerta.setDataAttivazione(java.time.LocalDate.now());
                offertaRepository.save(offerta);
            }
            return offerta;
        }
    
}
