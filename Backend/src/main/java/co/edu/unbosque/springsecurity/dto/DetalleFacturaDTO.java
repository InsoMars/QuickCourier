package co.edu.unbosque.springsecurity.dto;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter


public class DetalleFacturaDTO {

    private Long idDetalleFacturaProducto;
    private int cantidadProducto;
    private Double subtotalProducto;
    private Long idProducto;


   @Override
public String toString() {
    return "DetalleFacturaDTO{" +
            "idProducto=" + idProducto +
            ", cantidadProducto=" + cantidadProducto +
            '}';
}
    
    
}
