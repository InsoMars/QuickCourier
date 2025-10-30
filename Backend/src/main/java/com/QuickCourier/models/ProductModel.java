package com.QuickCourier.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table (name="producto")
public class ProductModel {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_product")
    private Long idProducto;

    @Column(name = "descripcion_prod")
    private String descripcion_prod;

    @Column(name = "precio_uni_prod")
    private Double precioUniProd;

    @Column(name = "categoria_prod")
    private String categoriaProd;

    @Column(name = "nombre_prod")
    private String nombreProd;

    @Column(name = "peso_prod")
    private Double pesoProd;


    
    public Long getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(Long idProducto) {
        this.idProducto = idProducto;
    }

    public String getDescripcion_prod() {
        return descripcion_prod;
    }

    public void setDescripcion_prod(String descripcion_prod) {
        this.descripcion_prod = descripcion_prod;
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

    public String getNombreProd() {
        return nombreProd;
    }

    public void setNombreProd(String nombreProd) {
        this.nombreProd = nombreProd;
    }

    public Double getPesoProd() {
        return pesoProd;
    }

    public void setPesoProd(Double pesoProd) {
        this.pesoProd = pesoProd;
    }


    







    
}
