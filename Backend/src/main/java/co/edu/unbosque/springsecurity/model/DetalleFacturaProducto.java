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


@Getter 
@Setter
@Entity


@Table(name="detalle_factura_producto")
public class DetalleFacturaProducto {

    @Id
    @Column(name="id_detalle_factura_producto")
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long idDetalleFacturaProducto;

    @Column(name="cantidad_producto")
    private int cantidadProducto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto; 


    @Column(name="subtotal_producto")
    private Double subtotalProducto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_factura", nullable = false)
    private Factura factura;  


    
    
}
