package co.edu.unbosque.springsecurity.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
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



 public Map<String, Object> procesarPedido(CalculoEnvioDTO pedido) {
        double pesoTotal = calcularPeso(pedido.getProductos());
        double precioTotal = calcularPrecio(pedido.getProductos());

        Map<String, Object> response = new HashMap<>();
        response.put("mensaje", "Pedido recibido correctamente");
        response.put("ciudad", pedido.getCiudad());
        response.put("extras", pedido.getExtras());
        response.put("productos", pedido.getProductos());
        response.put("pesoTotal", pesoTotal);
        response.put("precioTotal", precioTotal);

        System.out.println("Peso total calculado: " + pesoTotal);
        System.out.println("Precio total calculado: " + precioTotal);

        return response;
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



    public CalculoEnvioResponseDTO calcularCostoEnvioBase(List<DetalleFacturaDTO> productos, String ciudad,
                                         boolean empaqueRegalo, boolean envioExpress,
                                         boolean envioSeguro, boolean manejoFragil) {

        double pesoTotal = 0;
        double totalCompra = 0;

        for (DetalleFacturaDTO detalle : productos) {
            Producto prod = productoRepository.findById(detalle.getIdProducto())
                    .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con ID: " + detalle.getIdProducto()));

            pesoTotal += prod.getPesoProd() * detalle.getCantidadProducto();
            totalCompra += prod.getPrecioUniProd() * detalle.getCantidadProducto();
        }

        

        // 🔹 Crear tarifa base según la ciudad
        Tarifa tarifa = TarifaFactory.calcularTarifaBase(ciudad);

        // 🔹 Aplicar extras con patrón Decorator
        if (empaqueRegalo) tarifa = new ExtraEmpaqueRegalo(tarifa);
        if (envioExpress) tarifa = new ExtraEntregaExpress(tarifa);
        if (envioSeguro) tarifa = new ExtraEnvioSeguro(tarifa);
        if (manejoFragil) tarifa = new ExtraManejoFragil(tarifa);

        // 🔹 Calcular costo de envío total
        double costoEnvio = tarifa.calcularTarifa(pesoTotal);
        double totalFinal =totalCompra + costoEnvio;

       

        // 🔹 Mostrar datos en consola para depuración
        System.out.println("Ciudad: " + ciudad);
        System.out.println("Peso total: " + pesoTotal + " kg");
        System.out.println("Total compra: $" + totalCompra);
        System.out.println("Costo envío: $" + costoEnvio);

        // 🔹 Retornar el costo total del pedido
         return new CalculoEnvioResponseDTO(totalCompra, costoEnvio, pesoTotal, totalFinal);
    }




   public String obtenerDescripcionTarifa(String ciudad, Double peso, boolean  empaqueRegalo, boolean envioExpress, boolean envioSeguro , boolean manejoFragil) {

    Tarifa tarifa= TarifaFactory.calcularTarifaBase(ciudad);

    if(empaqueRegalo) tarifa= new ExtraEmpaqueRegalo(tarifa);
   if(envioExpress) tarifa= new ExtraEntregaExpress(tarifa);
   if (envioSeguro) tarifa = new ExtraEnvioSeguro(tarifa);
   if(manejoFragil) tarifa = new ExtraManejoFragil(tarifa);

   return tarifa.getDescripcion();

}


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
