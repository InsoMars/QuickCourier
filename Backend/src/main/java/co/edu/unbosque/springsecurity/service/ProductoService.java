// src/main/java/co/edu/unbosque/springsecurity/service/ProductoService.java

package co.edu.unbosque.springsecurity.service;

import co.edu.unbosque.springsecurity.dto.ProductoDTO;
import co.edu.unbosque.springsecurity.model.Producto;
import co.edu.unbosque.springsecurity.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    private ProductoDTO convertirADto(Producto producto) {
        
        return ProductoDTO.builder()
                .idProducto(producto.getIdProducto())
                .nombreProd(producto.getNombreProd())
                .descripcionProd(producto.getDescripcionProd())
                .precioUniProd(producto.getPrecioUniProd())
                .categoriaProd(producto.getCategoriaProd())
                .pesoProd(producto.getPesoProd())
                // Mapeo con TRADUCCIÓN (rutaProd -> rutaImagen)
                .rutaImagen(producto.getRutaProd()) 
                .build();
    }

    public List<ProductoDTO> findAllProductos() {
        return productoRepository.findAll().stream()
                .map(this::convertirADto)
                .collect(Collectors.toList());
    }
}