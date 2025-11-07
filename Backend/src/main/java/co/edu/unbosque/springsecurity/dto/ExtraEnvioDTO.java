package co.edu.unbosque.springsecurity.dto;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
 
@Getter
@Setter
@Data
@Builder
 
 
public class ExtraEnvioDTO {
 
 
    private String nombre;
 
    private String descripcion;
 
    private Double precio;

    private String codigo;
 

 
}