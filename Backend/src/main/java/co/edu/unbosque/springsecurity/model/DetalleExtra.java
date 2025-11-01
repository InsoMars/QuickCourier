package co.edu.unbosque.springsecurity.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="detalle_extra")
public class DetalleExtra {


    @Id
    @Column(name = "id_detalle_extra")
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long idDetalleExtra;

    @Column(name = "subtotal_detalle_extra")
    private Double subtototalDetalleExtra;



    @OneToOne
    @JoinColumn (name= "id_extra", nullable= false)
    private Extra idExtra;
    






    
}
