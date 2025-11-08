package co.edu.unbosque.springsecurity.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import co.edu.unbosque.springsecurity.dto.FacturaDTO;
import co.edu.unbosque.springsecurity.service.FacturaService;

@RestController
@RequestMapping("/facturas")
public class FacturaController {

    @Autowired
    private FacturaService facturaService;

    @GetMapping("/ultima")
    public FacturaDTO obtenerUltimaFactura() {
        return facturaService.obtenerUltimaFactura();
    }
}
