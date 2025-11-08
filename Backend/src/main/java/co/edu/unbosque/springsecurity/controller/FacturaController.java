package co.edu.unbosque.springsecurity.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import co.edu.unbosque.springsecurity.dto.FacturaDTO;
import co.edu.unbosque.springsecurity.service.FacturaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/facturas")
@Tag(name = "Factura Controller", description = "Permite consultar la factura generada por el sistema.")

public class FacturaController {

    @Autowired
    private FacturaService facturaService;


     @Operation(
        summary = "Obtener última factura",
        description = "Retorna la información de la factura más reciente generada en el sistema.",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Última factura obtenida exitosamente",
                content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = FacturaDTO.class))
            ),
            @ApiResponse(
                responseCode = "404",
                description = "No se encontró ninguna factura registrada",
                content = @Content
            ),
            @ApiResponse(
                responseCode = "500",
                description = "Error interno al obtener la factura",
                content = @Content
            )
        }
    )
    

    @GetMapping("/ultima")
    public FacturaDTO obtenerUltimaFactura() {
        return facturaService.obtenerUltimaFactura();
    }
}
