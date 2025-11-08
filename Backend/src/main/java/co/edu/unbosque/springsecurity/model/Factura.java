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

@Entity

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


  

  

   




    public Long getIdNumFacProd() {
        return idNumFacProd;
    }


    public void setIdNumFacProd(Long idNumFacProd) {
        this.idNumFacProd = idNumFacProd;
    }


    public LocalDateTime getFechaFacProd() {
        return fechaFacProd;
    }


    public void setFechaFacProd(LocalDateTime fechaFacProd) {
        this.fechaFacProd = fechaFacProd;
    }


    public Cliente getCliente() {
        return cliente;
    }


    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }


   


    public Zona getZona() {
        return zona;
    }


    public void setZona(Zona zona) {
        this.zona = zona;
    }


    


    public double getImpuesto() {
        return impuesto;
    }


    public void setImpuesto(double impuesto) {
        this.impuesto = impuesto;
    }


    public Double getTotalFacProd() {
        return totalFacProd;
    }


    public void setTotalFacProd(Double totalFacProd) {
        this.totalFacProd = totalFacProd;
    }


 


    public double getPeso() {
        return peso;
    }


    public void setPeso(double peso) {
        this.peso = peso;
    }


    public List<DetalleExtra> getDetalleExtra() {
        return detalleExtra;
    }


    public void setDetalleExtra(List<DetalleExtra> detalleExtra) {
        this.detalleExtra = detalleExtra;
    }


    public List<DetalleFacturaProducto> getDetalleFactura() {
        return detalleFactura;
    }


    public void setDetalleFactura(List<DetalleFacturaProducto> detalleFactura) {
        this.detalleFactura = detalleFactura;
    }


    

    










    
}
