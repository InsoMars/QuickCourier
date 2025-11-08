package co.edu.unbosque.springsecurity.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import co.edu.unbosque.springsecurity.dto.DetalleExtraDTO;
import co.edu.unbosque.springsecurity.dto.DetalleProductoDTO;
import co.edu.unbosque.springsecurity.dto.FacturaDTO;
import co.edu.unbosque.springsecurity.model.Factura;
import co.edu.unbosque.springsecurity.repository.DetalleExtraRepository;
import co.edu.unbosque.springsecurity.repository.DetalleFacturaRepository;
import co.edu.unbosque.springsecurity.repository.FacturaProductoRepository;

@Service
public class FacturaService {

    @Autowired
    private FacturaProductoRepository facturaRepository;

    @Autowired
    private DetalleFacturaRepository detalleFacturaRepository;

    @Autowired
    private DetalleExtraRepository detalleExtraRepository;

    public FacturaDTO obtenerUltimaFactura() {

      
        Factura factura = facturaRepository.findUltimaFactura()
                .orElseThrow(() -> new RuntimeException("No existen facturas registradas."));

        var cliente = factura.getCliente();
        var zona = factura.getZona();

      
        List<DetalleProductoDTO> productos = detalleFacturaRepository.findByFactura(factura)
                .stream()
                .map(det -> new DetalleProductoDTO(
                        det.getCantidadProducto(),
                        det.getProducto().getIdProducto().intValue(),
                        det.getProducto().getNombreProd(),
                        BigDecimal.valueOf(det.getSubtotalProducto())
                ))
                .collect(Collectors.toList());

     
        List<DetalleExtraDTO> extras = detalleExtraRepository.findByFactura(factura)
                .stream()
                .map(ext -> new DetalleExtraDTO(
                        ext.getExtra().getIdExtra().intValue(),
                        ext.getExtra().getNombreExtra(),
                        BigDecimal.valueOf(ext.getSubtototalDetalleExtra())
                ))
                .collect(Collectors.toList());

      
        return new FacturaDTO(
                cliente.getEmail(),
                BigDecimal.valueOf(zona.getPrecioZona() != null ? zona.getPrecioZona() : 0.0),
                extras,
                factura.getFechaFacProd(),
                factura.getIdNumFacProd() != null ? factura.getIdNumFacProd().intValue() : null,
                BigDecimal.valueOf(factura.getImpuesto()),
                cliente.getNombre(),
                BigDecimal.valueOf(factura.getPeso()),
                productos,
                cliente.getTelefono(),
                BigDecimal.valueOf(factura.getTotalFacProd() != null ? factura.getTotalFacProd() : 0.0),
                zona.getNombreZona()
                );

    }
}
