package com.QuickCourier.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table (name="zona")
public class ZonaModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idZona;

    @Column(name="precio_zona")
    private Double precioZona;

    @Column(name="nombre_zona")
    private String nombreZona;

    public Long getIdZona() {
        return idZona;
    }

    public void setIdZona(Long idZona) {
        this.idZona = idZona;
    }

    public Double getPrecioZona() {
        return precioZona;
    }

    public void setPrecioZona(Double precioZona) {
        this.precioZona = precioZona;
    }

    public String getNombreZona() {
        return nombreZona;
    }

    public void setNombreZona(String nombreZona) {
        this.nombreZona = nombreZona;
    }


    
    
}
