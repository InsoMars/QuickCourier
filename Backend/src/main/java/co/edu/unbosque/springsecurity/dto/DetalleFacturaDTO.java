package co.edu.unbosque.springsecurity.dto;

import co.edu.unbosque.springsecurity.model.Producto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DetalleFacturaDTO {

    private Long idDetalleFacturaProducto;
    private int cantidadProducto;
    private Double subtotalProducto;
    private Producto idProducto;
    
    
}
