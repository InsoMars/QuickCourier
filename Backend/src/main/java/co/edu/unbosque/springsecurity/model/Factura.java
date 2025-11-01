package co.edu.unbosque.springsecurity.model;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="factura_producto")
public class Factura {

    @Id
    @Column(name="id_num_fac_prod")
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long idNumFacProd;

    @Column(name="fecha_fac_prod")
    private Date fechaFacProd;


    @Column(name="impuesto_fac_prod")
    private Double impuestoFacProd;

    @Column(name="total_fac_prod")
    private Double totalFacProd;


    @ManyToOne 
    @JoinColumn(name="id_cliente", nullable= false)
    private Cliente idCliente;

    @ManyToOne 
    @JoinColumn(name="id_detalle_factura_producto", nullable= false)
    private DetalleFacturaProducto iDetalleFacturaProducto;


    @ManyToOne
    @JoinColumn(name="id_zona", nullable= false)
    private Zona idZona;


    @ManyToOne
    @JoinColumn(name="id_detalle_extra", nullable= false)
    private Zona idDetalleExtra;


    @ManyToOne
    @JoinColumn(name="id_peso", nullable= false)
    private TarifaPeso idPeso;
















    
}
