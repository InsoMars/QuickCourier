package com.QuickCourier.services;

import org.springframework.stereotype.Service;

import com.QuickCourier.services.Factory.Envio;
import com.QuickCourier.services.Factory.EnvioFactory;

@Service
public class PedidoService {

    public double calcularCostoEnvio(String localidad, double peso){
        Envio envio= EnvioFactory.crearEnvio();
        return envio.calcularCosto(peso, localidad);
        
    }
    
}
