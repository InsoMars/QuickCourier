package co.edu.unbosque.springsecurity.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;


@Entity
@Getter 
@Setter
@Table(name="producto")
public class Producto {

    @Id
    @Column(name = "id_producto")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idProducto;

    @Column(name = "nombre_prod")
    private String nombreProd;

    @Column(name = "descripcion_prod")
    private String descripcionProd;

    @Column(name = "precio_uni_prod")
    private Double precioUniProd;

    @Column(name = "categoria_prod")
    private String categoriaProd;

    @Column(name = "peso_prod")
    private Double pesoProd;

    @Column(name = "ruta_prod")
    private String rutaProd;


    public Producto() {
        
    }

    public Producto(Long idProducto, String nombreProd, String descripcionProd, Double precioUniProd,
            String categoriaProd, Double pesoProd, String rutaProd) {
        this.idProducto = idProducto;
        this.nombreProd = nombreProd;
        this.descripcionProd = descripcionProd;
        this.precioUniProd = precioUniProd;
        this.categoriaProd = categoriaProd;
        this.pesoProd = pesoProd;
        this.rutaProd = rutaProd;
    }


    
}
