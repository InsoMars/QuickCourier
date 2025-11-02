package co.edu.unbosque.springsecurity.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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




public Double calcularCostoEnvioBase(String ciudad, Double peso, boolean  empaqueRegalo, boolean envioExpress, boolean envioSeguro , boolean manejoFragil){

   Tarifa tarifa= TarifaFactory.calcularTarifaBase(ciudad);

   if(empaqueRegalo) tarifa= new ExtraEmpaqueRegalo(tarifa);
   if(envioExpress) tarifa= new ExtraEntregaExpress(tarifa);
   if (envioSeguro) tarifa = new ExtraEnvioSeguro(tarifa);
   if(manejoFragil) tarifa = new ExtraManejoFragil(tarifa);



   return tarifa.calcularTarifa(peso);
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
