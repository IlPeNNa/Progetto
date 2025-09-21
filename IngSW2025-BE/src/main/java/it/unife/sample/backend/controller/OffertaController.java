package it.unife.sample.backend.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import it.unife.sample.backend.model.Offerta;
import it.unife.sample.backend.service.OffertaService;

@RestController
@RequestMapping("/offerte")
public class OffertaController {
    @Autowired
    private OffertaService offertaService;

    @GetMapping
    public List<Offerta> getOfferteValide(
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) String durataMese,
            @RequestParam(required = false) String prezzoMax) {
        System.out.println("Chiamata ricevuta su /offerte");
        Integer durataMeseInt = null;
        BigDecimal prezzoMaxDec = null;
        if (durataMese != null && !durataMese.isEmpty()) {
            try {
                durataMeseInt = Integer.parseInt(durataMese);
            } catch (NumberFormatException e) {
                System.out.println("Durata mese non valida: " + durataMese);
            }
        }
        if (prezzoMax != null && !prezzoMax.isEmpty()) {
            try {
                prezzoMaxDec = new BigDecimal(prezzoMax);
            } catch (NumberFormatException e) {
                System.out.println("Prezzo max non valido: " + prezzoMax);
            }
        }
        String tipoVal = (tipo != null && !tipo.isEmpty()) ? tipo : null;
        return offertaService.filtraOfferte(tipoVal, durataMeseInt, prezzoMaxDec);
    }

    @GetMapping("/suggerita")
    public Offerta getOffertaSuggerita(
            @RequestParam String tipo,
            @RequestParam(required = false) BigDecimal consumoMedio
    ) {
        return offertaService.getOffertaSuggerita(tipo, consumoMedio);
    }
}
