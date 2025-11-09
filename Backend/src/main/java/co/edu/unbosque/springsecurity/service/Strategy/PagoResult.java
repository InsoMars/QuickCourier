package co.edu.unbosque.springsecurity.service.Strategy;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class PagoResult {
    private Double montoFinal;
    private String codigoPago; 
}