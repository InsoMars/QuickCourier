package com.QuickCourier.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table (name="peso")
public class PesoModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPeso;

    @Column (name="descripcion_peso")
    private String descripcionPeso;


    @Column (name="precio_peso")
    private Double precioPeso;


    public Long getIdPeso() {
        return idPeso;
    }


    public void setIdPeso(Long idPeso) {
        this.idPeso = idPeso;
    }


    public String getDescripcionPeso() {
        return descripcionPeso;
    }


    public void setDescripcionPeso(String descripcionPeso) {
        this.descripcionPeso = descripcionPeso;
    }


    public Double getPrecioPeso() {
        return precioPeso;
    }


    public void setPrecioPeso(Double precioPeso) {
        this.precioPeso = precioPeso;
    }
    

    
}
