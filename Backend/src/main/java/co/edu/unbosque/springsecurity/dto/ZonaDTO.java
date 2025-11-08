package co.edu.unbosque.springsecurity.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ZonaDTO {

    private String nombreZona;
    private Double precioZona;

    public ZonaDTO(String nombreZona, Double precioZona) {
        this.nombreZona = nombreZona;
        this.precioZona = precioZona;
    }
    

    
}
