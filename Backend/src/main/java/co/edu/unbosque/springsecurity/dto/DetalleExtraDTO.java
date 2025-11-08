package co.edu.unbosque.springsecurity.dto;

import java.math.BigDecimal;

public class DetalleExtraDTO {

    private Integer idExtra;
    private String nombreExtra;
    private BigDecimal subtotal;

    public DetalleExtraDTO(Integer idExtra, String nombreExtra, BigDecimal subtotal) {
        this.idExtra = idExtra;
        this.nombreExtra = nombreExtra;
        this.subtotal = subtotal;
    }

    public DetalleExtraDTO() {
    }

    public Integer getIdExtra() {
        return idExtra;
    }

    public void setIdExtra(Integer idExtra) {
        this.idExtra = idExtra;
    }

    public String getNombreExtra() {
        return nombreExtra;
    }

    public void setNombreExtra(String nombreExtra) {
        this.nombreExtra = nombreExtra;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    
}
