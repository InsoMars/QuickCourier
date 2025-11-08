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
    private Producto producto; // 🔹 Relación con producto


    @Column(name="subtotal_producto")
    private Double subtotalProducto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_factura", nullable = false)
    private Factura factura;  // 🔹 Relación con la factura principal






    public Long getIdDetalleFacturaProducto() {
        return idDetalleFacturaProducto;
    }


    public void setIdDetalleFacturaProducto(Long idDetalleFacturaProducto) {
        this.idDetalleFacturaProducto = idDetalleFacturaProducto;
    }


    public int getCantidadProducto() {
        return cantidadProducto;
    }


    public void setCantidadProducto(int cantidadProducto) {
        this.cantidadProducto = cantidadProducto;
    }


    public Producto getProducto() {
        return producto;
    }


    public void setProducto(Producto producto) {
        this.producto = producto;
    }


    public Double getSubtotalProducto() {
        return subtotalProducto;
    }


    public void setSubtotalProducto(Double subtotalProducto) {
        this.subtotalProducto = subtotalProducto;
    }


    public Factura getFactura() {
        return factura;
    }


    public void setFactura(Factura factura) {
        this.factura = factura;
    }

    



    
  
    
    
}
