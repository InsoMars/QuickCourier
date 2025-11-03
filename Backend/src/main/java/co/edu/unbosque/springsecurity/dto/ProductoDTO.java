package co.edu.unbosque.springsecurity.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Builder
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class ProductoDTO {

    private Long idProducto;
    private String nombreProd;
    private String descripcionProd;
    private Double precioUniProd;
    private String categoriaProd;
    private Double pesoProd;
    private String rutaImagen;

}
