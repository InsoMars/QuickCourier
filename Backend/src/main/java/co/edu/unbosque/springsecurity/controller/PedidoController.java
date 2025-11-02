package co.edu.unbosque.springsecurity.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import co.edu.unbosque.springsecurity.service.PedidoService;


@RestController
@RequestMapping ("/pedido")
public class PedidoController {

    @Autowired
    PedidoService pedidoService;



    @GetMapping("/tarifa-base")
    public Double calcularCostoEnvioBase(@AuthenticationPrincipal UserDetails user, @RequestParam String ciudad, @RequestParam Double peso) {
        return pedidoService.calcularCostoEnvioBase(ciudad, peso);
        
    }
    

    
    
}
