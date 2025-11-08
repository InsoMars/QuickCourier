package co.edu.unbosque.springsecurity.dto;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter


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


    
}
