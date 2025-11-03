package co.edu.unbosque.springsecurity.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import co.edu.unbosque.springsecurity.dto.CalculoEnvioDTO;
import co.edu.unbosque.springsecurity.dto.CalculoEnvioResponseDTO;
import co.edu.unbosque.springsecurity.dto.ExtraEnvioDTO;
import co.edu.unbosque.springsecurity.dto.ZonaDTO;
import co.edu.unbosque.springsecurity.service.PedidoService;


@RestController
@RequestMapping ("/pedido")
public class PedidoController {

    @Autowired
    PedidoService pedidoService;





    @PostMapping("/calcular-envio")
    public ResponseEntity<CalculoEnvioResponseDTO> calcularEnvio(@RequestBody CalculoEnvioDTO request) {
    CalculoEnvioResponseDTO response = pedidoService.calcularCostoEnvioBase(
        request.getProductos(),
        request.getCiudad(),
        request.isEmpaqueRegalo(),
        request.isEnvioExpress(),
        request.isEnvioSeguro(),
        request.isManejoFragil()
    );
    return ResponseEntity.ok(response);
}



@GetMapping("/extras")
 
    public List<ExtraEnvioDTO> obtenerExtrasExistentes() {
 
        return pedidoService.obtenerExtrasExistentes();
 
    }

    @GetMapping("/zonas")
    public List<ZonaDTO> obtenerZonas() {
        return pedidoService.obtenerZonasExistentes();
    }





    
    

    
    
}

