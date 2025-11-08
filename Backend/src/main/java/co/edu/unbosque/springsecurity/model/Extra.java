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

  
    
}