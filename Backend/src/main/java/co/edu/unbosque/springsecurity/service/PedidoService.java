package co.edu.unbosque.springsecurity.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import co.edu.unbosque.springsecurity.dto.DetalleFacturaDTO;
import co.edu.unbosque.springsecurity.dto.ExtraEnvioDTO;
import co.edu.unbosque.springsecurity.model.Producto;
import co.edu.unbosque.springsecurity.repository.ExtraEnvioRepository;
import co.edu.unbosque.springsecurity.repository.ProductoRepository;
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




    public Double calcularCostoEnvioBase(List<DetalleFacturaDTO> productos, String ciudad,
                                         boolean empaqueRegalo, boolean envioExpress,
                                         boolean envioSeguro, boolean manejoFragil) {

        double pesoTotal = 0;
        double totalCompra = 0;

        // 🔹 Calcular peso y total de productos
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

       

        // 🔹 Mostrar datos en consola para depuración
        System.out.println("Ciudad: " + ciudad);
        System.out.println("Peso total: " + pesoTotal + " kg");
        System.out.println("Total compra: $" + totalCompra);
        System.out.println("Costo envío: $" + costoEnvio);

        // 🔹 Retornar el costo total del pedido
        return totalCompra + costoEnvio;
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


    
}
