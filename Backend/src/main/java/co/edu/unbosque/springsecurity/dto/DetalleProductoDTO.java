package co.edu.unbosque.springsecurity.dto;

import java.math.BigDecimal;



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

    public Integer getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(Integer idProducto) {
        this.idProducto = idProducto;
    }

    public String getNombreProducto() {
        return nombreProducto;
    }

    public void setNombreProducto(String nombreProducto) {
        this.nombreProducto = nombreProducto;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }


}
