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
@Table(name="detalle_factura_producto")
public class DetalleFacturaProducto {

    @Id
    @Column(name="id_detalle_factura_producto")
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long idDetalleFacturaProducto;

    @Column(name="cantidad_producto")
    private int cantidadProducto;


    @Column(name="subtotal_producto")
    private Double subtotalProducto;


    @OneToOne
    @JoinColumn(name="id_product", nullable= false)
    private Producto idProducto;
    
    
}
