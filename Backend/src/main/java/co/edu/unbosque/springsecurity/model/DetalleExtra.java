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
    private Extra extra; // 🔹 Relación con el extra específico

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_factura", nullable = false)
    private Factura factura; // 🔹 Relación con la factura principal


    public Long getIdDetalleExtra() {
        return idDetalleExtra;
    }



    public void setIdDetalleExtra(Long idDetalleExtra) {
        this.idDetalleExtra = idDetalleExtra;
    }



    public Double getSubtototalDetalleExtra() {
        return subtototalDetalleExtra;
    }



    public void setSubtototalDetalleExtra(Double subtototalDetalleExtra) {
        this.subtototalDetalleExtra = subtototalDetalleExtra;
    }



    public Extra getExtra() {
        return extra;
    }



    public void setExtra(Extra extra) {
        this.extra = extra;
    }



    public Factura getFactura() {
        return factura;
    }



    public void setFactura(Factura factura) {
        this.factura = factura;
    }

    


    
    






    
}
