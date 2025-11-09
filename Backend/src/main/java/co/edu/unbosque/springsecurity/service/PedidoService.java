package co.edu.unbosque.springsecurity.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import co.edu.unbosque.springsecurity.dto.CalculoEnvioDTO;
import co.edu.unbosque.springsecurity.dto.CalculoEnvioResponseDTO;
import co.edu.unbosque.springsecurity.dto.DetalleFacturaDTO;
import co.edu.unbosque.springsecurity.dto.ExtraEnvioDTO;
import co.edu.unbosque.springsecurity.dto.ZonaDTO;
import co.edu.unbosque.springsecurity.model.Cliente;
import co.edu.unbosque.springsecurity.model.DetalleExtra;
import co.edu.unbosque.springsecurity.model.DetalleFacturaProducto;
import co.edu.unbosque.springsecurity.model.Extra;
import co.edu.unbosque.springsecurity.model.Factura;
import co.edu.unbosque.springsecurity.model.Producto;
import co.edu.unbosque.springsecurity.model.Zona;
import co.edu.unbosque.springsecurity.repository.ClienteRepository;
import co.edu.unbosque.springsecurity.repository.DetalleExtraRepository;
import co.edu.unbosque.springsecurity.repository.DetalleFacturaRepository;
import co.edu.unbosque.springsecurity.repository.ExtraEnvioRepository;
import co.edu.unbosque.springsecurity.repository.FacturaProductoRepository;
import co.edu.unbosque.springsecurity.repository.ProductoRepository;
import co.edu.unbosque.springsecurity.repository.ZonaRepository;
import co.edu.unbosque.springsecurity.service.Decorator.ExtraEmpaqueRegalo;
import co.edu.unbosque.springsecurity.service.Decorator.ExtraEntregaExpress;
import co.edu.unbosque.springsecurity.service.Decorator.ExtraEnvioSeguro;
import co.edu.unbosque.springsecurity.service.Decorator.ExtraManejoFragil;
import co.edu.unbosque.springsecurity.service.Factory.Tarifa;
import co.edu.unbosque.springsecurity.service.Factory.TarifaFactory;
import co.edu.unbosque.springsecurity.service.Strategy.ControladorPago;
import co.edu.unbosque.springsecurity.service.Strategy.DescuentoFinDeSemana;
import co.edu.unbosque.springsecurity.service.Strategy.DescuentoPrimeraCompra;
import co.edu.unbosque.springsecurity.service.Strategy.GestorDescuentos;
import co.edu.unbosque.springsecurity.service.Strategy.PagoResult;
import co.edu.unbosque.springsecurity.service.Strategy.PagoStrategy;

@Service
public class PedidoService {

    @Autowired
    private TarifaFactory tarifaFactory;

    @Autowired
    private ExtraEnvioRepository extraEnvioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private ZonaRepository zonaRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private DescuentoPrimeraCompra descuentoPrimeraCompra;

    @Autowired 
    private ControladorPago controladorPago;

    @Autowired
    private FacturaProductoRepository facturaRepository;

    @Autowired
    private DetalleFacturaRepository detalleFacturaRepository;

    @Autowired
    private DetalleExtraRepository detalleExtraRepository;


    public CalculoEnvioResponseDTO calcularEnvioCompleto(CalculoEnvioDTO pedido, String username) {

        double pesoTotal = calcularPeso(pedido.getProductos());
        double subtotal = calcularPrecio(pedido.getProductos());

        Tarifa tarifa = TarifaFactory.calcularTarifaBase(pedido.getCiudad());

        List<String> extras = pedido.getExtras() == null ? List.of() : pedido.getExtras();
        if (extras.contains("regalo")) tarifa = new ExtraEmpaqueRegalo(tarifa);
        if (extras.contains("express")) tarifa = new ExtraEntregaExpress(tarifa);
        if (extras.contains("seguro"))  tarifa = new ExtraEnvioSeguro(tarifa);
        if (extras.contains("fragil"))  tarifa = new ExtraManejoFragil(tarifa);

        double costoEnvio = tarifa.calcularTarifa(pesoTotal);
        double totalProductos = subtotal;

        //descuentos
        GestorDescuentos gestor = new GestorDescuentos();
        gestor.agregarEstrategia(descuentoPrimeraCompra);
        gestor.agregarEstrategia(new DescuentoFinDeSemana());

        double envioConDescuento = gestor.aplicarDescuentos(costoEnvio, username);

        ControladorPago controladorPago = new ControladorPago();
        PagoStrategy medioPago = controladorPago.procesarPago(pedido.getMedioPago());
        PagoResult resultadoPago = medioPago.realizarPago(totalProductos);

        Double ajusteMedioPago = resultadoPago.getMontoFinal();
        String codigoPagoEfecty = resultadoPago.getCodigoPago(); 

        Double iva = 0.19;
        Double precioDespuesImpuestos = totalProductos + totalProductos * iva;
        Double costoTotalPedido = precioDespuesImpuestos + ajusteMedioPago + envioConDescuento;

        Cliente cliente = clienteRepository.findByEmail(username)
                .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado"));

        Zona zona = zonaRepository.findByNombreZonaIgnoreCase(pedido.getCiudad())
                .orElseThrow(() -> new IllegalArgumentException("Zona no encontrada"));

        // Guardar factura 
        Factura factura = toEntity(pedido, cliente, zona, subtotal, pesoTotal, costoTotalPedido, iva);
        factura = facturaRepository.save(factura);

        // Guardar productos 
        for (DetalleFacturaDTO detalleDTO : pedido.getProductos()) {
            Producto producto = productoRepository.findById(detalleDTO.getIdProducto())
                    .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado"));
            DetalleFacturaProducto detalle = toEntity(detalleDTO, factura, producto);
            detalleFacturaRepository.save(detalle);
        }

        // Guardar extras 
        if (pedido.getExtras() != null && !pedido.getExtras().isEmpty()) {
            for (String codigoExtra : pedido.getExtras()) {
                Extra extra = extraEnvioRepository.findByCodigoExtraIgnoreCase(codigoExtra)
                        .orElseThrow(() -> new IllegalArgumentException("Extra no encontrado: " + codigoExtra));
                DetalleExtra detExtra = toEntity(extra, factura);
                detalleExtraRepository.save(detExtra);
            }
        }

        System.out.println(" Ciudad: " + pedido.getCiudad());
        System.out.println(" Peso total: " + pesoTotal + " kg");
        System.out.println(" Precio con IVA: " + precioDespuesImpuestos);
        System.out.println(" Costo envío: " + costoEnvio);
        System.out.println(" Envio con descuento: " + envioConDescuento);
        System.out.println(" ajusteMedioPago (medio de pago): " + ajusteMedioPago);
        System.out.println(" Total final: " + costoTotalPedido);

        return toDTO(factura, envioConDescuento, codigoPagoEfecty);
    }


    private Factura toEntity(CalculoEnvioDTO pedido, Cliente cliente, Zona zona,
                             double subtotal, double pesoTotal, double costoTotal, double iva) {
        Factura factura = new Factura();
        factura.setCliente(cliente);
        factura.setZona(zona);
        factura.setFechaFacProd(LocalDateTime.now());
        factura.setImpuesto(subtotal * iva);
        factura.setPeso(pesoTotal);
        factura.setTotalFacProd(costoTotal);
        return factura;
    }

    private DetalleFacturaProducto toEntity(DetalleFacturaDTO dto, Factura factura, Producto producto) {
        DetalleFacturaProducto detalle = new DetalleFacturaProducto();
        detalle.setFactura(factura);
        detalle.setProducto(producto);
        detalle.setCantidadProducto(dto.getCantidadProducto());
        detalle.setSubtotalProducto(producto.getPrecioUniProd() * dto.getCantidadProducto());
        return detalle;
    }

    private DetalleExtra toEntity(Extra extra, Factura factura) {
        DetalleExtra detExtra = new DetalleExtra();
        detExtra.setFactura(factura);
        detExtra.setExtra(extra);
        detExtra.setSubtototalDetalleExtra(extra.getPrecioExtra());
        return detExtra;
    }

   private CalculoEnvioResponseDTO toDTO(Factura factura, double envioConDescuento, String codigoPago) {
    return new CalculoEnvioResponseDTO(
        factura.getTotalFacProd() - factura.getImpuesto(),
        envioConDescuento,
        factura.getPeso(),
        factura.getTotalFacProd(),
        codigoPago
    );
}



    public Double calcularPeso(List<DetalleFacturaDTO> productos) {
        double pesoTotal = 0;
        for (DetalleFacturaDTO detalle : productos) {
            Producto prod = productoRepository.findById(detalle.getIdProducto())
                    .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con ID: " + detalle.getIdProducto()));
            pesoTotal += prod.getPesoProd() * detalle.getCantidadProducto();
        }
        return pesoTotal;
    }

    private double calcularPrecio(List<DetalleFacturaDTO> productos) {
        double total = 0;
        for (DetalleFacturaDTO detalle : productos) {
            Producto prod = productoRepository.findById(detalle.getIdProducto())
                    .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con ID: " + detalle.getIdProducto()));
            total += prod.getPrecioUniProd() * detalle.getCantidadProducto();
        }
        return total;
    }


    public String obtenerDescripcionTarifa(String ciudad, Double peso,
                                           boolean empaqueRegalo, boolean envioExpress,
                                           boolean envioSeguro, boolean manejoFragil) {

        Tarifa tarifa = TarifaFactory.calcularTarifaBase(ciudad);

        if (empaqueRegalo) tarifa = new ExtraEmpaqueRegalo(tarifa);
        if (envioExpress) tarifa = new ExtraEntregaExpress(tarifa);
        if (envioSeguro) tarifa = new ExtraEnvioSeguro(tarifa);
        if (manejoFragil) tarifa = new ExtraManejoFragil(tarifa);

        return tarifa.getDescripcion();
    }

    public List<ExtraEnvioDTO> obtenerExtrasExistentes() {
        return extraEnvioRepository.findAll()
                .stream()
                .map(extra -> new ExtraEnvioDTO(
                        extra.getNombreExtra(),
                        extra.getDescripcionExtra(),
                        extra.getPrecioExtra(),
                        extra.getCodigoExtra()))
                .collect(Collectors.toList());
    }

    public List<ZonaDTO> obtenerZonasExistentes() {
        return zonaRepository.findAll()
                .stream()
                .map(zona -> new ZonaDTO(zona.getNombreZona(), zona.getPrecioZona()))
                .collect(Collectors.toList());
    }
}
