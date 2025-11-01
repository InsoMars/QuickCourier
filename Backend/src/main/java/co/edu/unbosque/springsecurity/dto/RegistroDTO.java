package co.edu.unbosque.springsecurity.dto;

import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter

public class RegistroDTO {
    private String nombreCompleto;
    private String correoElectronico;
    private String cedula;
    private String direccion;
    private String contrasena;
    private String telefono;

    
}
