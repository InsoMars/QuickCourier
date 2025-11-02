package co.edu.unbosque.springsecurity.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import co.edu.unbosque.springsecurity.service.Factory.Tarifa;
import co.edu.unbosque.springsecurity.service.Factory.TarifaFactory;

@Service
public class PedidoService {

@Autowired
private TarifaFactory tarifaFactory;



public Double calcularCostoEnvioBase(String ciudad, Double peso){

   Tarifa tarifa= TarifaFactory.calcularTarifaBase(ciudad);

   return tarifa.calcularTarifa(peso);
} 
    
}
