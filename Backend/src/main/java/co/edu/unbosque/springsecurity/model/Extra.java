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
    @Column(name = "id_extra")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idExtra;
    
    @Column(name = "id_nombre_extra")
    private String nombreExtra;

    @Column(name = "id_precio_extra")
    private Double precioExtra;


    
}
