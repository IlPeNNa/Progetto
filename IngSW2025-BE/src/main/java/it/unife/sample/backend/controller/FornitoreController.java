package it.unife.sample.backend.controller;

import it.unife.sample.backend.model.Fornitore;
import it.unife.sample.backend.service.FornitoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fornitori")
@CrossOrigin
public class FornitoreController {
    @Autowired
    private FornitoreService fornitoreService;

    @GetMapping("")
    public List<Fornitore> getAllFornitori() {
        return fornitoreService.getAllFornitori();
    }
}
