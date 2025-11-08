package co.edu.unbosque.springsecurity.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class FacturaDTO {

    private Integer idFactura;
    private LocalDateTime fecha;
    private String nombreCliente;
    private String correoCliente;
    private String telefonoCliente;
    private String zonaEnvio;
    private BigDecimal costoZona;
    private BigDecimal pesoTotal;
    private BigDecimal impuesto;
    private BigDecimal totalFactura;

    private List<DetalleProductoDTO> productos;
    private List<DetalleExtraDTO> extras;

    public FacturaDTO(
        String correoCliente,
        BigDecimal costoZona,
        List<DetalleExtraDTO> extras,
        LocalDateTime fecha,
        Integer idFactura,
        BigDecimal impuesto,
        String nombreCliente,
        BigDecimal pesoTotal,
        List<DetalleProductoDTO> productos,
        String telefonoCliente,
        BigDecimal totalFactura,
        String zonaEnvio
    ) {
        this.correoCliente = correoCliente;
        this.costoZona = costoZona;
        this.extras = extras;
        this.fecha = fecha;
        this.idFactura = idFactura;
        this.impuesto = impuesto;
        this.nombreCliente = nombreCliente;
        this.pesoTotal = pesoTotal;
        this.productos = productos;
        this.telefonoCliente = telefonoCliente;
        this.totalFactura = totalFactura;
        this.zonaEnvio = zonaEnvio;
    }

    public FacturaDTO() {}

    public Integer getIdFactura() {
        return idFactura;
    }

    public void setIdFactura(Integer idFactura) {
        this.idFactura = idFactura;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public String getNombreCliente() {
        return nombreCliente;
    }

    public void setNombreCliente(String nombreCliente) {
        this.nombreCliente = nombreCliente;
    }

    public String getCorreoCliente() {
        return correoCliente;
    }

    public void setCorreoCliente(String correoCliente) {
        this.correoCliente = correoCliente;
    }

    public String getTelefonoCliente() {
        return telefonoCliente;
    }

    public void setTelefonoCliente(String telefonoCliente) {
        this.telefonoCliente = telefonoCliente;
    }

    public String getZonaEnvio() {
        return zonaEnvio;
    }

    public void setZonaEnvio(String zonaEnvio) {
        this.zonaEnvio = zonaEnvio;
    }

    public BigDecimal getCostoZona() {
        return costoZona;
    }

    public void setCostoZona(BigDecimal costoZona) {
        this.costoZona = costoZona;
    }

    public BigDecimal getPesoTotal() {
        return pesoTotal;
    }

    public void setPesoTotal(BigDecimal pesoTotal) {
        this.pesoTotal = pesoTotal;
    }

    public BigDecimal getImpuesto() {
        return impuesto;
    }

    public void setImpuesto(BigDecimal impuesto) {
        this.impuesto = impuesto;
    }

    public BigDecimal getTotalFactura() {
        return totalFactura;
    }

    public void setTotalFactura(BigDecimal totalFactura) {
        this.totalFactura = totalFactura;
    }

    public List<DetalleProductoDTO> getProductos() {
        return productos;
    }

    public void setProductos(List<DetalleProductoDTO> productos) {
        this.productos = productos;
    }

    public List<DetalleExtraDTO> getExtras() {
        return extras;
    }

    public void setExtras(List<DetalleExtraDTO> extras) {
        this.extras = extras;
    }

}
