package co.edu.unbosque.springsecurity.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


@Entity
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

    public Long getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(Long idProducto) {
        this.idProducto = idProducto;
    }

    public String getNombreProd() {
        return nombreProd;
    }

    public void setNombreProd(String nombreProd) {
        this.nombreProd = nombreProd;
    }

    public String getDescripcionProd() {
        return descripcionProd;
    }

    public void setDescripcionProd(String descripcionProd) {
        this.descripcionProd = descripcionProd;
    }

    public Double getPrecioUniProd() {
        return precioUniProd;
    }

    public void setPrecioUniProd(Double precioUniProd) {
        this.precioUniProd = precioUniProd;
    }

    public String getCategoriaProd() {
        return categoriaProd;
    }

    public void setCategoriaProd(String categoriaProd) {
        this.categoriaProd = categoriaProd;
    }

    public Double getPesoProd() {
        return pesoProd;
    }

    public void setPesoProd(Double pesoProd) {
        this.pesoProd = pesoProd;
    }

    public String getRutaProd() {
        return rutaProd;
    }

    public void setRutaProd(String rutaProd) {
        this.rutaProd = rutaProd;
    }

    
}
