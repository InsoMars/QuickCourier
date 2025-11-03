package co.edu.unbosque.springsecurity.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class ProductoDTO {


    private Long idProducto;
    private String nombreProd;
    private String descripcionProd;
    private Double precioUniProd;
    private String categoriaProd;
    private Double pesoProd;
    private String rutaProd;

}
