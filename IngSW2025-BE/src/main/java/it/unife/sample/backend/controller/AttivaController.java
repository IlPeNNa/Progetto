package it.unife.sample.backend.controller;

import it.unife.sample.backend.model.Attiva;
import it.unife.sample.backend.service.AttivaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/attiva")
@CrossOrigin(origins = "http://localhost:4200")
public class AttivaController {
    @Autowired
    private AttivaService attivaService;

    @GetMapping
    public List<Attiva> getAll() {
        return attivaService.findAll();
    }

    @PostMapping
    public Attiva create(@RequestBody Attiva attiva) {
        return attivaService.save(attiva);
    }

    @GetMapping(params = "cf")
    public List<Attiva> getByCf(@RequestParam String cf) {
        return attivaService.findByCf(cf);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAttivazione(@RequestParam String cf, @RequestParam Integer idOfferta) {
        attivaService.deleteAttivazione(cf, idOfferta);
        return ResponseEntity.ok().build();
    }
}
