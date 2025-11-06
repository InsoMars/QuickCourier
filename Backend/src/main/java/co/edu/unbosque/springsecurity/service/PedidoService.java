package co.edu.unbosque.springsecurity.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import co.edu.unbosque.springsecurity.dto.CalculoEnvioDTO;
import co.edu.unbosque.springsecurity.dto.CalculoEnvioResponseDTO;
import co.edu.unbosque.springsecurity.dto.DetalleFacturaDTO;
import co.edu.unbosque.springsecurity.dto.ExtraEnvioDTO;
import co.edu.unbosque.springsecurity.dto.ZonaDTO;
import co.edu.unbosque.springsecurity.model.Producto;
import co.edu.unbosque.springsecurity.repository.ExtraEnvioRepository;
import co.edu.unbosque.springsecurity.repository.ProductoRepository;
import co.edu.unbosque.springsecurity.repository.ZonaRepository;
import co.edu.unbosque.springsecurity.service.Decorator.ExtraEmpaqueRegalo;
import co.edu.unbosque.springsecurity.service.Decorator.ExtraEntregaExpress;
import co.edu.unbosque.springsecurity.service.Decorator.ExtraEnvioSeguro;
import co.edu.unbosque.springsecurity.service.Decorator.ExtraManejoFragil;
import co.edu.unbosque.springsecurity.service.Factory.Tarifa;
import co.edu.unbosque.springsecurity.service.Factory.TarifaFactory;
import co.edu.unbosque.springsecurity.service.Strategy.ControladorPago;
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
private ControladorPago controladorPago;





public CalculoEnvioResponseDTO calcularEnvioCompleto(CalculoEnvioDTO pedido) {
    // 1️⃣ Calcular subtotal y peso total
    double pesoTotal = calcularPeso(pedido.getProductos());
    double subtotal = calcularPrecio(pedido.getProductos());

    // 2️⃣ Crear tarifa base según la ciudad
    Tarifa tarifa = TarifaFactory.calcularTarifaBase(pedido.getCiudad());

    // 3️⃣ Aplicar extras desde la lista (si existen)
    List<String> extras = pedido.getExtras() == null ? List.of() : pedido.getExtras();
    if (extras.contains("empaquederegalo")) tarifa = new ExtraEmpaqueRegalo(tarifa);
    if (extras.contains("entregaexprés") || extras.contains("entregaexpres")) tarifa = new ExtraEntregaExpress(tarifa);
    if (extras.contains("envioseguro") || extras.contains("envíoasegurado")) tarifa = new ExtraEnvioSeguro(tarifa);
    if (extras.contains("manejofrágil") || extras.contains("manejofragil")) tarifa = new ExtraManejoFragil(tarifa);


     // 4️⃣ Calcular costo de envío total y suma final
    double costoEnvio = tarifa.calcularTarifa(pesoTotal);
    double totalFinal = subtotal + costoEnvio;


    ControladorPago controladorPago= new ControladorPago();

    PagoStrategy medioPago= controladorPago.procesarPago(pedido.getMedioPago());

    Double ajuste= medioPago.realizarPago(totalFinal);

    totalFinal+= ajuste;


    // 5️⃣ Logs de depuración
    System.out.println("📦 Ciudad: " + pedido.getCiudad());
    System.out.println("⚖️ Peso total: " + pesoTotal + " kg");
    System.out.println("💰 Subtotal productos: " + subtotal);
    System.out.println("🚚 Costo envío: " + costoEnvio);
    System.out.println("🔹 Ajuste (medio de pago): " + ajuste);
    

    System.out.println("🔹 Total final: " + totalFinal);

    // 6️⃣ Retornar DTO con todos los valores
    return new CalculoEnvioResponseDTO(subtotal, costoEnvio, pesoTotal, totalFinal);
}





public Double calcularPeso(List<DetalleFacturaDTO> productos) {
 
        double pesoTotal = 0;
 
        for (DetalleFacturaDTO detalle : productos) {
            Producto prod = productoRepository.findById(detalle.getIdProducto())
                    .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con ID: " + detalle.getIdProducto()));
 
            pesoTotal += prod.getPesoProd() * detalle.getCantidadProducto();
        }
 
 
 
        return  pesoTotal;

      }


 private double calcularPrecio(List<DetalleFacturaDTO> productos) {
        double total = 0;
        for (DetalleFacturaDTO detalle : productos) {
            Producto prod = productoRepository.findById(detalle.getIdProducto())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Producto no encontrado con ID: " + detalle.getIdProducto()));
            total += prod.getPrecioUniProd() * detalle.getCantidadProducto();
        }
        return total;
    }



   public String obtenerDescripcionTarifa(String ciudad, Double peso, boolean  empaqueRegalo, boolean envioExpress, boolean envioSeguro , boolean manejoFragil) {

    Tarifa tarifa= TarifaFactory.calcularTarifaBase(ciudad);

    if(empaqueRegalo) tarifa= new ExtraEmpaqueRegalo(tarifa);
   if(envioExpress) tarifa= new ExtraEntregaExpress(tarifa);
   if (envioSeguro) tarifa = new ExtraEnvioSeguro(tarifa);
   if(manejoFragil) tarifa = new ExtraManejoFragil(tarifa);

   return tarifa.getDescripcion();

}

/////////////////MOSTRAR CIUDADES Y EXTRAS EN FRONT//////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
public List<ExtraEnvioDTO> obtenerExtrasExistentes(){
 return  extraEnvioRepository.findAll()
             .stream()
             .map(extra -> ExtraEnvioDTO.builder()
             .nombre(extra.getNombreExtra())
             .descripcion(extra.getDescripcionExtra())
             .precio(extra.getPrecioExtra())
             .build())
             .toList();
 
}


  public List<ZonaDTO> obtenerZonasExistentes() {
    return zonaRepository.findAll()
            .stream()
            .map(zona -> new ZonaDTO(zona.getNombreZona(), zona.getPrecioZona()))
            .collect(Collectors.toList());
}


    
}
