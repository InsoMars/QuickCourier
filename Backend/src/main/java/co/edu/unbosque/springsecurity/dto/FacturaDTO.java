package co.edu.unbosque.springsecurity.dto;


import java.util.Date;

import co.edu.unbosque.springsecurity.model.Cliente;
import co.edu.unbosque.springsecurity.model.DetalleFacturaProducto;
import co.edu.unbosque.springsecurity.model.TarifaPeso;
import co.edu.unbosque.springsecurity.model.Zona;
import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter

public class FacturaDTO {

    private Long idProducto;
    private Long idNumFacProd;
    private Date fechaFacProd;
    private Double impuestoFacProd;
    private Double totalFacProd;
    private Cliente idCliente;
    private DetalleFacturaProducto iDetalleFacturaProducto;
    private Zona idZona;
    private Zona idDetalleExtra;
    private TarifaPeso idPeso;
    
}
