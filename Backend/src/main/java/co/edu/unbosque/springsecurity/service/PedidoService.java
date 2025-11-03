package co.edu.unbosque.springsecurity.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import co.edu.unbosque.springsecurity.dto.DetalleFacturaDTO;
import co.edu.unbosque.springsecurity.model.Producto;
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
private ProductoRepository productoRepository;




public Double calcularCostoEnvioBase(List <DetalleFacturaDTO> productos, String ciudad, boolean  empaqueRegalo, boolean envioExpress, boolean envioSeguro , boolean manejoFragil){

   double pesoTotal=0;
   double totalCompra=0;


   for (DetalleFacturaDTO detalle : productos) {
            Producto prod = productoRepository.findById(detalle.getIdProducto())
                    .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con ID: " + detalle.getIdProducto()));

            pesoTotal += prod.getPesoProd() * detalle.getCantidadProducto();
            totalCompra += prod.getPrecioUniProd() * detalle.getCantidadProducto();
        }


   Tarifa tarifa= TarifaFactory.calcularTarifaBase(ciudad);


   if(empaqueRegalo) tarifa= new ExtraEmpaqueRegalo(tarifa);
   if(envioExpress) tarifa= new ExtraEntregaExpress(tarifa);
   if (envioSeguro) tarifa = new ExtraEnvioSeguro(tarifa);
   if(manejoFragil) tarifa = new ExtraManejoFragil(tarifa);

   double costoEnvio= tarifa.calcularTarifa(pesoTotal);
    System.out.println("Peso total: " + pesoTotal + " kg");
    System.out.println("Total compra: $" + totalCompra);



   return costoEnvio;
} 


public String obtenerDescripcionTarifa(String ciudad, Double peso, boolean  empaqueRegalo, boolean envioExpress, boolean envioSeguro , boolean manejoFragil) {

    Tarifa tarifa= TarifaFactory.calcularTarifaBase(ciudad);

    if(empaqueRegalo) tarifa= new ExtraEmpaqueRegalo(tarifa);
   if(envioExpress) tarifa= new ExtraEntregaExpress(tarifa);
   if (envioSeguro) tarifa = new ExtraEnvioSeguro(tarifa);
   if(manejoFragil) tarifa = new ExtraManejoFragil(tarifa);

   return tarifa.getDescripcion();

}


    
}
