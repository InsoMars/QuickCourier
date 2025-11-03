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
@Table(name="zona")
@Getter
@Setter

public class Zona {

    @Id
    @Column(name="id_zona")
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long idZona;

    @Column(name="nombre_zona")
    private String nombreZona;

    @Column(name="precio_zona")
    private Double precioZona;
    
}
