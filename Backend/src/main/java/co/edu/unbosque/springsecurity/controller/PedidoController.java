package co.edu.unbosque.springsecurity.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
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




 /*
    @PostMapping("/calcular-envio")
    public ResponseEntity<CalculoEnvioResponseDTO> calcularEnvio(@AuthenticationPrincipal UserDetails user,
@RequestBody CalculoEnvioDTO request) {


    String username = user.getUsername();
    System.out.println("Pedido realizado por: " + username);

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
 */
@PostMapping("/calcular-envio")
public ResponseEntity<CalculoEnvioResponseDTO> calcularEnvio(
        @AuthenticationPrincipal UserDetails user,
        @RequestBody CalculoEnvioDTO pedido) {

    String username = (user != null) ? user.getUsername() : "anon";
    System.out.println("Petición calcular-envio por: " + username);

    CalculoEnvioResponseDTO response = pedidoService.calcularEnvioCompleto(pedido, username);
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


@PostMapping("/crear")
public ResponseEntity<CalculoEnvioResponseDTO> crearPedido(@AuthenticationPrincipal UserDetails user, @RequestBody CalculoEnvioDTO pedido) {

    String username = user.getUsername(); 
    System.out.println("📩 Pedido recibido de: " + username);
    System.out.println("📩 Pedido recibido:");
    System.out.println("Ciudad: " + pedido.getCiudad());
    System.out.println("Extras: " + pedido.getExtras());
    System.out.println("Productos: " + pedido.getProductos());

    CalculoEnvioResponseDTO respuesta = pedidoService.calcularEnvioCompleto(pedido, username);
    return ResponseEntity.ok(respuesta);
}

    
@PostMapping("/calcular-peso")
    public ResponseEntity<Double> calcularPeso(
    @RequestBody CalculoEnvioDTO request) {
 
 
   
 
    Double response = pedidoService.calcularPeso(
        request.getProductos()
       
    );
    return ResponseEntity.ok(response);
}    

    
    
}

