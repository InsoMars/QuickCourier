package co.edu.unbosque.springsecurity.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter

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


}
