package it.unife.sample.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import it.unife.sample.backend.service.UserSalaryService;

@RestController
@RequestMapping("/api/salary")
public class UserSalaryController {
    @Autowired
    private UserSalaryService userSalaryService;

    @GetMapping("/{cf}/netto")
    public double getStipendioNetto(@PathVariable String cf) {
        return userSalaryService.getStipendioNetto(cf);
    }
}
