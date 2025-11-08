package co.edu.unbosque.springsecurity.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import co.edu.unbosque.springsecurity.dto.ProductoDTO;
import co.edu.unbosque.springsecurity.service.ProductoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/QuickCourier/Productos/Catalogo")
@CrossOrigin (origins = "http://127.0.0.1:5500")
@Tag(name = "Catálogo de Productos", description = "Permite consultar la lista de productos disponibles en QuickCourier.")

public class ProductoController {

    @Autowired
    private ProductoService productoService;


    @Operation(
        summary = "Obtener todos los productos",
        description = "Retorna la lista completa de productos disponibles en el catálogo. "
                    + "Solo puede ser accedida por usuarios autenticados con un token JWT válido."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de productos obtenida correctamente",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ProductoDTO.class))
        ),
        @ApiResponse(responseCode = "401", description = "Token no válido o expirado",
            content = @Content),
        @ApiResponse(responseCode = "403", description = "Acceso denegado: el usuario no tiene permisos suficientes",
            content = @Content),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor",
            content = @Content)
    })

    @GetMapping
    public ResponseEntity<List<ProductoDTO>> obtenerProductos(@AuthenticationPrincipal UserDetails user) {
        List<ProductoDTO> productos = productoService.findAllProductos();
        return ResponseEntity.ok(productos);
    }
}