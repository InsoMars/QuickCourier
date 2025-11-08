package co.edu.unbosque.springsecurity.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter


@Entity

@Table(name="zona")


public class Zona {

    @Id
    @Column(name="id_zona")
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long idZona;

    @Column(name="nombre_zona")
    private String nombreZona;

    @Column(name="precio_zona")
    private Double precioZona;

    public Long getIdZona() {
        return idZona;
    }

    public void setIdZona(Long idZona) {
        this.idZona = idZona;
    }

    public String getNombreZona() {
        return nombreZona;
    }

    public void setNombreZona(String nombreZona) {
        this.nombreZona = nombreZona;
    }

    public Double getPrecioZona() {
        return precioZona;
    }

    public void setPrecioZona(Double precioZona) {
        this.precioZona = precioZona;
    }




    
    
}
