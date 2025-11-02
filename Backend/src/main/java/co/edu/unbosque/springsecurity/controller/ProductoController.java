package co.edu.unbosque.springsecurity.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import co.edu.unbosque.springsecurity.dto.ProductoDTO;
import co.edu.unbosque.springsecurity.service.ProductoService;

@RestController
@RequestMapping("/QuickCourier/Productos/Catalogo")
@CrossOrigin (origins = "http://127.0.0.1:5500")
public class ProductoController {

    @Autowired
    private ProductoService productoService;
    
    @GetMapping
    public ResponseEntity<List<ProductoDTO>> obtenerProductos() {
        // Llama al servicio que ya hace el mapeo Entidad -> DTO
        List<ProductoDTO> productos = productoService.findAllProductos();
        return ResponseEntity.ok(productos);
    }
}

