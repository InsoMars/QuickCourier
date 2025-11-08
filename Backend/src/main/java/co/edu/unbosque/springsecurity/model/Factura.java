package co.edu.unbosque.springsecurity.model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter 
@Setter

@Table(name="factura_producto")
public class Factura {

    @Id
    @Column(name="id_num_fac_prod")
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long idNumFacProd;

    @Column(name="fecha_fac_prod")
    private LocalDateTime fechaFacProd;

    @ManyToOne
    @JoinColumn(name = "id_cliente", nullable = false)
    private Cliente cliente;




    @OneToMany(mappedBy = "factura", cascade = CascadeType.ALL)
    private List<DetalleExtra> detalleExtra;

    @ManyToOne
    @JoinColumn(name = "id_zona", nullable = false)
    private Zona zona;

    
    @Column(name = "peso_total", nullable = false)
    private double peso;

    @Column(name = "impuesto_fac_prod")
    private double impuesto;

    @Column(name="total_fac_prod")
    private Double totalFacProd;

    @OneToMany(mappedBy = "factura", cascade = CascadeType.ALL)
    private List<DetalleFacturaProducto> detalleFactura;

    
}
