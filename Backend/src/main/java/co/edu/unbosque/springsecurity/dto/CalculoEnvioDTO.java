package co.edu.unbosque.springsecurity.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter

public class CalculoEnvioDTO {


    private String ciudad;
    private boolean empaqueRegalo;
    private boolean envioExpress;
    private boolean envioSeguro;
    private boolean manejoFragil;
    private String medioPago;
    private List<String> extras;
    private List<DetalleFacturaDTO> productos;
    
}
