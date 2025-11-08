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
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;




@RestController
@RequestMapping ("/pedido")
@Tag(name = "Pedido Controller", description = "Gestiona operaciones relacionadas con los pedidos, como creación, cálculo de peso, obtención de extras y zonas disponibles.")
public class PedidoController {

    @Autowired
    PedidoService pedidoService;




   @Operation(
        summary = "Obtener extras disponibles",
        description = "Retorna una lista de servicios o extras opcionales que el usuario puede agregar al envío.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Lista obtenida exitosamente",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ExtraEnvioDTO.class))),
            @ApiResponse(responseCode = "500", description = "Error interno al obtener los extras", content = @Content)
        }
    )
@GetMapping("/extras")
 
    public List<ExtraEnvioDTO> obtenerExtrasExistentes() {
 
        return pedidoService.obtenerExtrasExistentes();
 
    }



    @Operation(
        summary = "Obtener zonas disponibles",
        description = "Devuelve todas las zonas o ciudades disponibles para realizar envíos.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Zonas obtenidas exitosamente",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ZonaDTO.class))),
            @ApiResponse(responseCode = "500", description = "Error interno al obtener las zonas", content = @Content)
        }
    )

    @GetMapping("/zonas")
    public List<ZonaDTO> obtenerZonas() {
        return pedidoService.obtenerZonasExistentes();
    }

  @Operation(
        summary = "Crear pedido y calcular envío completo",
        description = "Permite crear un nuevo pedido con la información del usuario autenticado, productos, ciudad y extras. Retorna el costo total del envío.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Pedido creado correctamente",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = CalculoEnvioResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Solicitud inválida", content = @Content),
            @ApiResponse(responseCode = "500", description = "Error interno al crear el pedido", content = @Content)
        }
    )   
@PostMapping("/crear")
public ResponseEntity<CalculoEnvioResponseDTO> crearPedido(@AuthenticationPrincipal UserDetails user, @RequestBody CalculoEnvioDTO pedido) {

    String username = user.getUsername(); 

    CalculoEnvioResponseDTO respuesta = pedidoService.calcularEnvioCompleto(pedido, username);
    return ResponseEntity.ok(respuesta);
}


@Operation(
        summary = "Calcular peso total de los productos",
        description = "Calcula el peso total del pedido con base en los productos seleccionados antes de generar la factura o envío.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Peso calculado correctamente",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Double.class))),
            @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos", content = @Content),
            @ApiResponse(responseCode = "500", description = "Error interno al calcular el peso", content = @Content)
        }
    )   
@PostMapping("/calcular-peso")
    public ResponseEntity<Double> calcularPeso(
    @RequestBody CalculoEnvioDTO request) {
 
    Double response = pedidoService.calcularPeso(
        request.getProductos()
       
    );
    return ResponseEntity.ok(response);
}  






    
    
}

