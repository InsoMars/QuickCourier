package co.edu.unbosque.springsecurity.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;


@Entity
@Getter 
@Setter

@Table(name="detalle_extra")
public class DetalleExtra {


    @Id
    @Column(name = "id_detalle_extra")
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long idDetalleExtra;

    @Column(name = "subtotal_detalle_extra")
    private Double subtototalDetalleExtra;



   @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_extra", nullable = false)
    private Extra extra; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_factura", nullable = false)
    private Factura factura; 

    
}
