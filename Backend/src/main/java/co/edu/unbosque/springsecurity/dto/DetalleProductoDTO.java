package co.edu.unbosque.springsecurity.dto;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter


public class DetalleProductoDTO {

    private Integer idProducto;
    private String nombreProducto;
    private Integer cantidad;
    private BigDecimal subtotal;

    public DetalleProductoDTO(Integer cantidad, Integer idProducto, String nombreProducto, BigDecimal subtotal) {
        this.cantidad = cantidad;
        this.idProducto = idProducto;
        this.nombreProducto = nombreProducto;
        this.subtotal = subtotal;
    }

    public DetalleProductoDTO() {
    }


}
