package co.edu.unbosque.springsecurity.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter


public class CalculoEnvioResponseDTO {
    private double totalCompra;   
    private double costoEnvio;    
    private double pesoTotal;     
    private double totalFinal;


    public CalculoEnvioResponseDTO(double totalCompra, double costoEnvio, double pesoTotal, double totalFinal) {
        this.totalCompra = totalCompra;
        this.costoEnvio = costoEnvio;
        this.pesoTotal = pesoTotal;
        this.totalFinal = totalFinal;
    }


    public CalculoEnvioResponseDTO() {
    }
    
    
}
