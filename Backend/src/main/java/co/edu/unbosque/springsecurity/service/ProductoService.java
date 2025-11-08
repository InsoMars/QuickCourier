// src/main/java/co/edu/unbosque/springsecurity/service/ProductoService.java

package co.edu.unbosque.springsecurity.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import co.edu.unbosque.springsecurity.dto.ProductoDTO;
import co.edu.unbosque.springsecurity.model.Producto;
import co.edu.unbosque.springsecurity.repository.ProductoRepository;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    private ProductoDTO convertirADto(Producto producto) {
    ProductoDTO dto = new ProductoDTO();
    dto.setIdProducto(producto.getIdProducto());
    dto.setNombreProd(producto.getNombreProd());
    dto.setDescripcionProd(producto.getDescripcionProd());
    dto.setPrecioUniProd(producto.getPrecioUniProd());
    dto.setCategoriaProd(producto.getCategoriaProd());
    dto.setPesoProd(producto.getPesoProd());
    dto.setRutaImagen(producto.getRutaProd());
    return dto;
}


    public List<ProductoDTO> findAllProductos() {
        return productoRepository.findAll().stream()
                .map(this::convertirADto)
                .collect(Collectors.toList());
    }
}