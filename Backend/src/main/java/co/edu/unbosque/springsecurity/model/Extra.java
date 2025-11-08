package co.edu.unbosque.springsecurity.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity

@Table(name="extra")

 
public class Extra {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_extra")
    private Long idExtra;
   
    @Column(name = "nombre_extra")
    private String nombreExtra;
 
    @Column(name = "precio_extra")
    private Double precioExtra;
 
    @Column(name="descripcion_extra")
    private String descripcionExtra;
 
    @Column(name="codigo_extra")
    private String codigoExtra;

    public Long getIdExtra() {
        return idExtra;
    }

    public void setIdExtra(Long idExtra) {
        this.idExtra = idExtra;
    }

    public String getNombreExtra() {
        return nombreExtra;
    }

    public void setNombreExtra(String nombreExtra) {
        this.nombreExtra = nombreExtra;
    }

    public Double getPrecioExtra() {
        return precioExtra;
    }

    public void setPrecioExtra(Double precioExtra) {
        this.precioExtra = precioExtra;
    }

    public String getDescripcionExtra() {
        return descripcionExtra;
    }

    public void setDescripcionExtra(String descripcionExtra) {
        this.descripcionExtra = descripcionExtra;
    }

    public String getCodigoExtra() {
        return codigoExtra;
    }

    public void setCodigoExtra(String codigoExtra) {
        this.codigoExtra = codigoExtra;
    }
 
    
 

    
    
}